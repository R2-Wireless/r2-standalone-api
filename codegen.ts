import { CodegenConfig, generate } from "npm:@graphql-codegen/cli@^3.2.1";
import "https://cdn.skypack.dev/graphql?dts";
import "npm:@graphql-codegen/add@^4.0.1";
import "npm:@graphql-codegen/typescript@^3.0.1";
import "npm:@graphql-codegen/typescript-resolvers@^3.1.0";
import "npm:@graphql-tools/schema@9.0.10";

const config: CodegenConfig = {
  schema: "./src/schema.graphql",
  generates: {
    "./src/generated/gql.ts": {
      config: {
        namingConvention: {
          default: "change-case#pascalCase",
          enumValues: "change-case#upperCase",
        },
        useIndexSignature: true,
        contextType: "../context.ts#GraphqlContext",
        scalars: {
          Timestamp: "Date",
        },
      },
      plugins: [
        "typescript",
        "typescript-resolvers",
        {
          add: {
            content: "// deno-lint-ignore-file",
            placement: "prepend",
          },
        },
      ],
    },
  },
};

generate(config, true);
