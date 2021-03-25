
/**
 *  Optimistic cache updates
 */
import Mingo from 'mingo';

/**
 * Safe getter
 * Must returns null if the document is absent (eg in case of validation failure)
 * TODO: use this getter
 * @param {*} mutation 
 * @param {*} mutationName 
 */
export const getDocumentFromMutation = (mutation, mutationName) => {
    const mutationData = (mutation.result.data[mutationName] || {});
    const document = mutationData.data;
    return document;
};

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

    // Customer(*) will be matched but no customer. This last one would cause an error in
    // JSON.parse. If wanted to be treated, parseQueryNameToVariables should be adapted
    const matchQueryReducer = (names, name) => {
        if (name.startsWith(queryName + '(')) {
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


/*

Test if a document is already in a result set

*/
export const isInData = ({ queryResult, multiResolverName, document }) => positionInSet(queryResult[multiResolverName].results, document) === -1;

export const positionInSet = (results, document) => results.findIndex(item => item._id && (item._id === document._id));


/*

Reorder results according to a sort

*/
export const reorderSet = (results, sort, selector) => {
    const mingoQuery = new Mingo.Query(selector);
    const cursor = mingoQuery.find(results);
    const sortedResults = cursor.sort(sort).all();
    return sortedResults;
};

/**
 * Add to data
 * @param {*} queryData 
 * @param {*} document 
 */
export const addToData = ({ queryResult, multiResolverName, document, sort, selector }) => {
    const queryData = queryResult[multiResolverName];
    let { results, totalCount } = queryData;
    const idx = positionInSet(results, document);
    let newResults = [...results];
    if (idx !== -1) {
        // doc has already been added, eg after an optimistic response
        // update it
        newResults[idx] = document;
    } else {
        // add to list
        newResults.unshift(document);
        totalCount = totalCount + 1;
    }
    // sort if necessary
    if (sort) {
        newResults = reorderSet(newResults, sort, selector);
    }
    return {
        ...queryResult,
        [multiResolverName]: {
            ...queryData,
            // TODO: check order using mingo
            results: newResults,
            totalCount
        }
    };
};


export const removeFromData = ({ queryResult, multiResolverName, document }) => {
    const queryData = queryResult[multiResolverName];
    return {
        ...queryResult,
        [multiResolverName]: {
            ...queryData,
            results: queryData.results.filter(item => item._id !== document._id),
            totalCount: Math.max(0, queryData.totalCount - 1)
        }
    };
};

/*

Test if a document is matched by a given selector

*/
export const matchSelector = (document, selector) => {
    const mingoQuery = new Mingo.Query(selector);
    return mingoQuery.test(document);
};


/*

Add a document to a set of results

*/
// export const addToSet = (queryData, document) => {
//   const newData = {
//     ...queryData,
//     results: [...queryData.results, document],
//     totalCount: queryData.totalCount + 1,
//   };
//   return newData;
// };

/*

Update a document in a set of results

*/
// TODO: legacy, not used anymore because Apollo handles it out of the box
/* export const updateInSet = (queryData, document) => {
  const oldDocument = queryData.results.find(item => item._id === document._id);
  const newDocument = { ...oldDocument, ...document };
  const index = queryData.results.findIndex(item => item._id === document._id);
  const newData = { ...queryData, results: [...queryData.results] }; // clone
  newData.results[index] = newDocument;
  return newData;
};
*/
