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
	deno run --watch src/main.ts