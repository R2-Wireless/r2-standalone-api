import { Server } from "https://deno.land/std@0.166.0/http/server.ts";
import { GraphQLHTTP } from "https://deno.land/x/gql@1.1.2/mod.ts";
import { makeExecutableSchema } from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";
import * as path from "node:path";
import * as gql from "./generated/gql.ts";

const dirname = import.meta.dirname!;
const typeDefs = await Deno.readTextFile(
  path.join(dirname, "schema.graphql"),
);

const sleep = (ms: number) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

const resolvers: gql.Resolvers = {
  Query: {
    test: async () => {
      await sleep(1_000);
      return true;
    },
  },
};

const schema = makeExecutableSchema({ resolvers, typeDefs });

const server = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
        schema,
        graphiql: true,
      })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

if (import.meta.main) {
  server.listenAndServe();
}
