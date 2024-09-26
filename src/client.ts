import { createClient } from "npm:graphql-ws@^5.16.0";
import callbackToAsyncIteratorModule from "npm:callback-to-async-iterator@*";
import ws from "npm:ws@^8.18.0";

const callbackToAsyncIterator = callbackToAsyncIteratorModule.default;

const graphqlUrl = "ws://localhost:3000";

const client = createClient({
  url: graphqlUrl,
  webSocketImpl: ws,
});

const wsClients = [] as (typeof client)[];

// deno-lint-ignore no-unused-vars
const terminate = () => {
  client.terminate();
  wsClients.forEach((wsClient) => {
    wsClient.terminate();
  });
};

// deno-lint-ignore no-explicit-any, no-unused-vars
const getGraphqlExecutable = <V extends undefined | Record<string, any>, T>(
  query: string,
): (variables: V) => Promise<{ data: T }> =>
async (variables) => {
  const response = await new Promise<{ data: T }>((resolve, reject) => {
    const unsubscribe = client.subscribe(
      {
        query,
        variables,
      },
      {
        next(eventData) {
          if (eventData.errors) {
            reject(eventData.errors);
          } else {
            // deno-lint-ignore no-explicit-any
            resolve(eventData as any);
          }
          unsubscribe();
        },
        error(err) {
          reject(err);
          unsubscribe();
        },
        complete() {
          unsubscribe();
        },
      },
    );
  });
  return response;
};
// deno-lint-ignore no-explicit-any
const getGraphqlSubscription = <V extends undefined | Record<string, any>, T>(
  query: string,
): (variables: V) => AsyncIterableIterator<{ data: T }> =>
(variables) => {
  // deno-lint-ignore prefer-const, no-explicit-any
  let asyncIteratorThrow: (() => Promise<any>) | undefined;
  const getListenPromise = (cb: (data: { data: T }) => void) =>
    new Promise<{ stop(): Promise<void> }>((resolve, reject) => {
      const wsClient = createClient({
        url: graphqlUrl,
        webSocketImpl: ws,
        keepAlive: 10_000,
      });
      let terminated = false;
      let pongTimeout: number | undefined;
      wsClients.push(wsClient);
      const onExit = () => {
        if (!terminated) {
          wsClients.splice(wsClients.indexOf(wsClient), 1);
          terminated = true;
          wsClient.terminate();
        }
      };
      wsClient.on("closed", () => {
        if (!terminated) {
          onExit();
          if (asyncIteratorThrow) {
            asyncIteratorThrow();
          }
        }
      });
      wsClient.on("ping", (received) => {
        if (received) {
          return;
        }
        // sent
        pongTimeout = setTimeout(() => {
          onExit();
          if (asyncIteratorThrow) {
            asyncIteratorThrow();
          }
        }, 15_000); // wait 15 seconds for the pong and then close the connection
      });
      wsClient.on("pong", (received) => {
        if (!received) {
          return;
        }
        clearTimeout(pongTimeout); // pong is received, clear connection close timeout
      });
      const unsubscribe = wsClient.subscribe(
        {
          query,
          variables,
        },
        {
          next(eventData) {
            // deno-lint-ignore no-explicit-any
            cb(eventData as any);
          },
          error(err) {
            reject(err);
            unsubscribe();
            onExit();
          },
          complete() {
            unsubscribe();
            onExit();
          },
        },
      );
      resolve({
        // deno-lint-ignore require-await
        stop: async () => {
          unsubscribe();
          onExit();
        },
      });
    });
  const asyncIterator = callbackToAsyncIterator<
    { data: T },
    { stop: () => Promise<void> }
  > // deno-lint-ignore no-explicit-any
  ((cb: any) => getListenPromise(cb), {
    // deno-lint-ignore no-explicit-any
    onClose({ stop }: { stop: any }) {
      stop();
    },
  });
  asyncIteratorThrow = asyncIterator.throw;
  return asyncIterator;
};

export type SubscriptionTest = {
  __typename?: "Subscription";
  test: number;
};

export const executeSubscriptionTest = getGraphqlSubscription<
  undefined,
  SubscriptionTest
>(`
subscription test {
  test
}
`);

for await (const res of executeSubscriptionTest(undefined)) {
  console.log(res);
}
