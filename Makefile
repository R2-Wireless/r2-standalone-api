codegen:
	deno run -A codegen.ts
format:
	deno fmt
lint:
	deno lint
typecheck:
	deno check src/**/*
test:
	deno test
start:
	deno run --watch --allow-read=./src/schema.graphql --allow-net=0.0.0.0:3000 src/main.ts