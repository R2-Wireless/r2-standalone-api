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
server:
	deno run --watch --allow-read --allow-env --allow-net=0.0.0.0:3000 src/server.ts
client:
	deno run --watch --allow-read --allow-env --allow-net=0.0.0.0:3000 src/client.ts