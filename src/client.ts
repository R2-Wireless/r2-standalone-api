import * as gql from "./generated/gql.ts";
import { createClient } from "graphql-ws";

const endpointUrl = "ws://0.0.0.0:3000/graphql";
const client = createClient({
  url: endpointUrl,
});

const statusSubscription = client.iterate<Pick<gql.Subscription, "status">>({
  query: `
subscription {
  status
}
`,
});
const next = await statusSubscription.next();
if (
  next.done || !next.value.data ||
  !(next.value.data.status === gql.Status.RUNNING)
) {
  throw new Error("System is not running, contact R2");
}

const detectionsSubscription = client.iterate<
  Pick<gql.Subscription, "detections">
>({
  query: `
subscription {
  detections {
    type_id
    type_name
  }
}
`,
});

for await (const result of detectionsSubscription) {
  if (!result.data) {
    throw new Error("System error, contact R2");
  }
  console.log(`Number of active threats: ${result.data.detections.length}`);
}
