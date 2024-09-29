import * as path from "node:path";
import * as gql from "./generated/gql.ts";
import { setTimeout } from "node:timers/promises";
import { createGraphqlContext } from "./context.ts";
import { createServer } from "node:http";
import { ApolloServer } from "npm:@apollo/server@^4.11.0";
import { ApolloServerPluginDrainHttpServer } from "npm:@apollo/server@^4.11.0/plugin/drainHttpServer";
import { expressMiddleware } from "npm:@apollo/server@^4.11.0/express4";
import { makeExecutableSchema } from "npm:@graphql-tools/schema@^10.0.6";
import { WebSocketServer } from "npm:ws@^8.18.0";
import { useServer } from "graphql-ws/lib/use/ws";
import express from "npm:express@^4.18.2";
import { subscribe } from "graphql";

const dirname = import.meta.dirname!;
const typeDefs = await Deno.readTextFile(
  path.join(dirname, "schema.graphql"),
);

const resolvers: gql.Resolvers = {
  Query: {
    test: async () => {
      await setTimeout(1_000);
      return true;
    },
  },
  Subscription: {
    test: {
      subscribe: async function* (_1, _2) {
        let i = 0;
        while (true) {
          yield {
            test: i++,
          };
          await setTimeout(1_000);
        }
      },
    },
    status: {
      subscribe: async function* (_1, _2) {
        yield {
          status: gql.Status.RUNNING,
        };
        while (true) {
          await setTimeout(1_000);
        }
      },
    },
    detections: {
      subscribe: async function* (_1, _2) {
        yield {
          detections: [],
        };
        await setTimeout(5_000);
        yield {
          detections: [{
            type_id: "1",
            type_name: "DJI",
          }],
        };
        await setTimeout(5_000);
        yield {
          detections: [{
            type_id: "1",
            type_name: "DJI",
          }, {
            type_id: "2",
            type_name: "AUTEL",
          }],
        };
        await setTimeout(5_000);
        yield {
          detections: [{
            type_id: "1",
            type_name: "DJI",
          }],
        };
        while (true) {
          await setTimeout(5_000);
        }
      },
    },
  },
};

if (import.meta.main) {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const port = 3000;
  const app = express();
  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql",
  });
  const serverCleanup = useServer(
    {
      schema,
      context: (data) =>
        createGraphqlContext(
          (data?.connectionParams ?? {}) as Record<string, string>,
        ),
      async subscribe(...args) {
        const result = await subscribe(...args);
        if ("next" in result) {
          // is an async iterable, augment the next method to handle thrown errors
          const originalNext = result.next;
          // deno-lint-ignore no-explicit-any
          (result as any).next = async () => {
            try {
              return await originalNext();
            } catch (err) {
              if (err instanceof Error) {
                return {
                  value: {
                    errors: [
                      {
                        ...err,
                        message: err.message,
                        path: args[0].document.definitions[0].loc !== undefined
                          ? args[0].document.definitions[0].loc.source.body
                            .split(
                              "\n",
                            )
                          : [],
                        extensions: {
                          code: err.name,
                          stacktrace: err.stack
                            ? err.stack.split("\n")
                            : [`${err.name}: ${err.message}`],
                          // deno-lint-ignore no-explicit-any
                          ...(err as any).extensions,
                        },
                      },
                    ],
                  },
                };
              }
              // gracefully handle the error thrown from the next method
            }
          };
        }
        return result;
      },
    },
    wsServer,
  );
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        // deno-lint-ignore require-await
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: (data) =>
        createGraphqlContext(data.req.headers as Record<string, string>),
    }),
  );

  httpServer.listen(port, () => {
    console.log(`🚀  Server ready at http://localhost:${port}/graphql`);
  });
}
