export const createGraphqlContext = async () => {
    return {};
};

export type GraphqlContext = Awaited<ReturnType<typeof createGraphqlContext>>;
