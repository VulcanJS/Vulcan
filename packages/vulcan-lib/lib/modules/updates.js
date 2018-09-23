import Mingo from 'mingo';

export const WatchedMutations = {};

export const registerWatchedMutation = (operation, typeName, updateFunction) => {
  WatchedMutations[`${operation}${typeName}`] = {
    [`multi${typeName}Query`]: updateFunction
  }
}

/*

Test if a document is matched by a given selector

*/
export const belongsToSet = (document, selector) => {
  const mingoQuery = new Mingo.Query(selector);
  return mingoQuery.test(document)
}

/*

Add a document to a set of results

*/
export const addToSet = (queryData, document) => {
  const newData = {
    results: [...queryData.results, document],
    totalCount: queryData.totalCount + 1
  }
  return newData;
};

/*

Reorder results according to a sort

*/
export const reorderSet = (queryData, sort) => {
  const mingoQuery = new Mingo.Query();
  const cursor = mingoQuery.find(queryData.results);
  queryData.results = cursor.sort(sort).all();
  return queryData;
};