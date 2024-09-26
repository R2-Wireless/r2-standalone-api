import { CodegenConfig, generate } from "@graphql-codegen/cli";

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
            content: "/* eslint-disable */",
            placement: "prepend",
          },
        },
      ],
    },
  },
};

generate(config, true);
