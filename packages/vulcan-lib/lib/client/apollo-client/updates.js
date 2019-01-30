/**
 * Helpers to update watched mutations
 */
import Mingo from 'mingo';

export const WatchedMutations = {};

export const registerWatchedMutation = (mutationName, queryName, updateFunction) => {
  WatchedMutations[mutationName] = {
    [queryName]: updateFunction,
  };
};

/*

Test if a document is matched by a given selector

*/
export const belongsToSet = (document, selector) => {
  const mingoQuery = new Mingo.Query(selector);
  return mingoQuery.test(document);
};

/*

Test if a document is already in a result set

*/
export const isInSet = (data, document) => data.results.find(item => item._id === document._id);

/*

Add a document to a set of results

*/
export const addToSet = (queryData, document) => {
  const newData = {
    results: [...queryData.results, document],
    totalCount: queryData.totalCount + 1,
  };
  return newData;
};

/*

Update a document in a set of results

*/
export const updateInSet = (queryData, document) => {
  const oldDocument = queryData.results.find(item => item._id === document._id);
  const newDocument = { ...oldDocument, ...document };
  const index = queryData.results.findIndex(item => item._id === document._id);
  const newData = { results: [...queryData.results] }; // clone
  newData.results[index] = newDocument;
  return newData;
};

/*

Reorder results according to a sort

*/
export const reorderSet = (queryData, sort, selector) => {
  const mingoQuery = new Mingo.Query(selector);
  const cursor = mingoQuery.find(queryData.results);
  queryData.results = cursor.sort(sort).all();
  return queryData;
};

/*

Remove a document from a set

*/
export const removeFromSet = (queryData, document) => {
  const newData = {
    results: queryData.results.filter(item => item._id !== document._id),
    totalCount: queryData.totalCount - 1,
  };
  return newData;
};
