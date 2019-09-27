/**
 *  Optimistic cache updates
 */


// When using multi queries, we can't track all parameters, which are sadly needed
// by cache.readQuery for optimistic updates.
// This function can get a list of queries based on their name and should solve this issue
// @see https://gist.github.com/ngryman/6856c7eb8f9a15b1095032a6ba478c5c
// @see https://github.com/apollographql/react-apollo/issues/708#issuecomment-506975142
// @see https://github.com/apollographql/apollo-client/issues/3505
// @see https://github.com/apollographql/apollo-client/issues/3505#issuecomment-535388194
export const getVariablesListFromCache = (proxy, queryName) => {
    //const queryName = query.definitions[0].name.value;
    const rootQuery = proxy.data.data.ROOT_QUERY;

    // XXX: When using `optimisticResponse`, `proxy.data.data` resolves to
    // another cache that doesn't contain the root query.
    if (!rootQuery) return [];

    const matchQueryReducer = (names, name) => {
        // TODO: can be improved with a regex so "customer" matched only "customer(*)"
        // this may match too many items
        if (name.startsWith(queryName)) {
            names.push(name);
        }
        return names;
    };

    const parseQueryNameToVariables = (name) =>
        JSON.parse((name.match(/{.*}/))[0]);

    return Object.keys(rootQuery)
        .reduce(matchQueryReducer, [])
        .map(parseQueryNameToVariables);
};


/**
 * Add to data
 * @param {*} queryData 
 * @param {*} document 
 */
export const addToData = ({ queryResult, multiResolverName, document }) => {
    const queryData = queryResult[multiResolverName];
    return {
        ...queryResult,
        [multiResolverName]: {
            ...queryData,
            // TODO: check order using mingo
            results: [...queryData.results, document],
            totalCount: queryData.totalCount + 1
        }
    };
};


/*

Remove a document from a set

*/
export const removeFromSet = (queryData, document) => {
    const newData = {
        ...queryData,
        results: queryData.results.filter(item => item._id !== document._id),
        totalCount: queryData.totalCount - 1,
    };
    return newData;
};
