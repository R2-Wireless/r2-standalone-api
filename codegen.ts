import fs from "node:fs";
import path from "node:path";
import { buildSchema, GraphQLSchema, parse, printSchema } from "graphql";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import { codegen } from "@graphql-codegen/core";

const dirname = import.meta.dirname!;

const schemaString = await Deno.readTextFile(
  path.join(dirname, "src", "schema.graphql"),
);
const outputFile = path.join(dirname, "src", "generated", "gql.ts");

const schema: GraphQLSchema = buildSchema(schemaString);
const config = {
  documents: [],
  config: {},
  // used by a plugin internally, although the 'typescript' plugin currently
  // returns the string output, rather than writing to a file
  filename: outputFile,
  schema: parse(printSchema(schema)),
  plugins: [
    // Each plugin should be an object
    {
      typescript: {}, // Here you can pass configuration to the plugin
    },
  ],
  pluginMap: {
    typescript: typescriptPlugin,
  },
};

const output = await codegen(config);
await Deno.writeTextFile(outputFile, output);
console.log("Outputs generated!");
