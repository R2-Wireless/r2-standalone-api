// deno-lint-ignore require-await
export const createGraphqlContext = async (headers: Record<string, string>) => {
    return headers;
};

export type GraphqlContext = Awaited<ReturnType<typeof createGraphqlContext>>;
