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
	$(eval GRAPHQL_ENDPOINT_URL ?= ws://0.0.0.0:3000/graphql)
	$(eval GRAPHQL_HOST = $(shell echo $(GRAPHQL_ENDPOINT_URL) | sed -E 's|^.*://([^/:]+)(:[0-9]+)?.*|\1\2|'))
	GRAPHQL_ENDPOINT_URL=$(GRAPHQL_ENDPOINT_URL) deno run --watch --allow-read --allow-env --allow-net=$(GRAPHQL_HOST) src/client.ts
