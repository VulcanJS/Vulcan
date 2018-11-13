/*

### withMulti

Paginated items container

Options: 

  - collection: the collection to fetch the documents from
  - fragment: the fragment that defines which properties to fetch
  - fragmentName: the name of the fragment, passed to getFragment
  - limit: the number of documents to show initially
  - pollInterval: how often the data should be updated, in ms (set to 0 to disable polling)
  - terms: an object that defines which documents to fetch

Props Received: 

  - terms: an object that defines which documents to fetch

Terms object can have the following properties:

  - view: String
  - userId: String
  - cat: String
  - date: String
  - after: String
  - before: String
  - enableTotal: Boolean
  - enableCache: Boolean
  - listId: String
  - query: String # search query
  - postId: String
  - limit: String
         
*/

import React, { Component } from 'react';
import { withApollo, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { getSetting, Utils, multiClientTemplate, extractCollectionInfo, extractFragmentInfo } from 'meteor/vulcan:lib';
import Mingo from 'mingo';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import find from 'lodash/find';

export default function withMulti(options) {
  // console.log(options)

  const {
    limit = 10,
    pollInterval = getSetting('pollInterval', 20000),
    enableTotal = true,
    enableCache = false,
    extraQueries
  } = options;

  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);

  const typeName = collection.options.typeName;
  const resolverName = collection.options.multiResolverName;

  // build graphql query from options
  const query = gql`
    ${multiClientTemplate({ typeName, fragmentName, extraQueries })}
    ${fragment}
  `;

  return compose(
    // wrap component with Apollo HoC to give it access to the store
    withApollo,

    // wrap component with HoC that manages the terms object via its state
    withState('paginationTerms', 'setPaginationTerms', props => {
      // get initial limit from props, or else options
      const paginationLimit = (props.terms && props.terms.limit) || limit;
      const paginationTerms = {
        limit: paginationLimit,
        itemsPerPage: paginationLimit
      };

      return paginationTerms;
    }),

    // wrap component with graphql HoC
    graphql(
      query,

      {
        alias: `with${Utils.pluralize(typeName)}`,

        // graphql query options
        options({ terms, paginationTerms, client: apolloClient, currentUser }) {
          // get terms from options, then props, then pagination
          const mergedTerms = { ...options.terms, ...terms, ...paginationTerms };

          const graphQLOptions = {
            variables: {
              input: {
                terms: mergedTerms,
                enableCache,
                enableTotal
              }
            },
            // note: pollInterval can be set to 0 to disable polling (20s by default)
            pollInterval,
            reducer: (previousResults, action) => {
              // see queryReducer function defined below
              return queryReducer(
                typeName,
                previousResults,
                action,
                collection,
                mergedTerms,
                resolverName,
                apolloClient
              );
            }
          };

          if (options.fetchPolicy) {
            graphQLOptions.fetchPolicy = options.fetchPolicy;
          }

          // set to true if running into https://github.com/apollographql/apollo-client/issues/1186
          if (options.notifyOnNetworkStatusChange) {
            graphQLOptions.notifyOnNetworkStatusChange = options.notifyOnNetworkStatusChange;
          }

          return graphQLOptions;
        },

        // define props returned by graphql HoC
        props(props) {
          // see https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
          const refetch = props.data.refetch,
            // results = Utils.convertDates(collection, props.data[listResolverName]),
            results = props.data[resolverName] && props.data[resolverName].results,
            totalCount = props.data[resolverName] && props.data[resolverName].totalCount,
            networkStatus = props.data.networkStatus,
            loadingInitial = props.data.networkStatus === 1,
            loading = props.data.networkStatus === 1,
            loadingMore = props.data.networkStatus === 2,
            error = props.data.error,
            propertyName = options.propertyName || 'results';

          if (error) {
            // eslint-disable-next-line no-console
            console.log(error);
          }

          return {
            // see https://github.com/apollostack/apollo-client/blob/master/src/queries/store.ts#L28-L36
            // note: loading will propably change soon https://github.com/apollostack/apollo-client/issues/831
            loading,
            loadingInitial,
            loadingMore,
            [propertyName]: results,
            totalCount,
            refetch,
            networkStatus,
            error,
            count: results && results.length,

            // regular load more (reload everything)
            loadMore(providedTerms) {
              // if new terms are provided by presentational component use them, else default to incrementing current limit once
              const newTerms =
                typeof providedTerms === 'undefined'
                  ? {
                      /*...props.ownProps.terms,*/ ...props.ownProps.paginationTerms,
                      limit: results.length + props.ownProps.paginationTerms.itemsPerPage
                    }
                  : providedTerms;

              props.ownProps.setPaginationTerms(newTerms);
            },

            // incremental loading version (only load new content)
            // note: not compatible with polling
            loadMoreInc(providedTerms) {
              // get terms passed as argument or else just default to incrementing the offset
              const newTerms =
                typeof providedTerms === 'undefined'
                  ? { ...props.ownProps.terms, ...props.ownProps.paginationTerms, offset: results.length }
                  : providedTerms;

              return props.data.fetchMore({
                variables: { input: { terms: newTerms } }, // ??? not sure about 'terms: newTerms'
                updateQuery(previousResults, { fetchMoreResult }) {
                  // no more post to fetch
                  if (!fetchMoreResult.data) {
                    return previousResults;
                  }
                  const newResults = {};
                  newResults[resolverName] = [...previousResults[resolverName], ...fetchMoreResult.data[resolverName]];
                  // return the previous results "augmented" with more
                  return { ...previousResults, ...newResults };
                }
              });
            },

            fragmentName,
            fragment,
            ...props.ownProps, // pass on the props down to the wrapped component
            data: props.data
          };
        }
      }
    )
  );
}

// define query reducer separately
const queryReducer = (typeName, previousResults, action, collection, mergedTerms, resolverName, apolloClient) => {
  // if collection has no mutations defined, just return previous results
  if (!collection.options.mutations) {
    return previousResults;
  }

  let newResults = previousResults;

  // get mongo selector and options objects based on current terms
  const result = collection.getParameters(mergedTerms, apolloClient);
  const { selector, options } = result;

  const mingoQuery = new Mingo.Query(selector);

  // function to remove a document from a results object, used by edit and remove cases below
  const removeFromResults = (data, document) => {
    const listWithoutDocument = data[resolverName].results.filter(doc => doc._id !== document._id);
    const currentTotalCount = data[resolverName].totalCount;
    const newResults = update(data, {
      [resolverName]: { $set: { results: listWithoutDocument, totalCount: currentTotalCount - 1 } }
    });
    return newResults;
  };

  // add document to a results object
  const addToResults = (data, document) => {
    const listWithDocument = [...data[resolverName].results, document];
    const currentTotalCount = data[resolverName].totalCount;
    const newResults = update(data, {
      [resolverName]: { $set: { results: listWithDocument, totalCount: currentTotalCount + 1 } }
    });
    return newResults;
  };

  // reorder results according to a sort
  const reorderResults = (data, sort) => {
    const list = data[resolverName].results;
    // const convertedList = Utils.convertDates(collection, list); // convert date strings to date objects
    const convertedList = list;
    const cursor = mingoQuery.find(convertedList);
    const sortedList = cursor.sort(sort).all();
    data[resolverName].results = sortedList;
    return data;
  };

  // console.log('// withList reducer');
  // console.log('terms: ', mergedTerms);
  // console.log('selector: ', selector);
  // console.log('options: ', options);
  // console.log('previousResults: ', previousResults);
  // console.log('action: ', action);

  switch (action.operationName) {
    case `create${typeName}`:
      // if new document belongs to current list (based on view selector), add it
      const newDocument = action.result.data[`create${typeName}`].data;
      if (mingoQuery.test(newDocument)) {
        if (!find(previousResults[resolverName].results, { _id: newDocument._id })) {
          // make sure it hasn't been already added despite being a create mutation
          // as this reducer may be called several times
          newResults = addToResults(previousResults, newDocument);
        }
        newResults = reorderResults(newResults, options.sort);
      }
      // console.log('** new **')
      // console.log('newDocument: ', newDocument)
      // console.log('belongs to list: ', mingoQuery.test(newDocument))
      break;

    case `update${typeName}`:
      const editedDocument = action.result.data[`update${typeName}`].data;
      if (mingoQuery.test(editedDocument)) {
        // edited document belongs to the list
        if (!find(previousResults[resolverName].results, { _id: editedDocument._id })) {
          // if document wasn't already in list, add it
          newResults = addToResults(previousResults, editedDocument);
        }
        newResults = reorderResults(newResults, options.sort);
      } else {
        // if edited doesn't belong to current list anymore (based on view selector), remove it
        newResults = removeFromResults(previousResults, editedDocument);
      }
      // console.log('** edit **')
      // console.log('editedDocument: ', editedDocument)
      // console.log('belongs to list: ', mingoQuery.test(editedDocument))
      // console.log('exists in list: ', !!_.findWhere(previousResults[resolverName].results, {_id: editedDocument._id}))
      break;

    case `delete${typeName}`:
      const removedDocument = action.result.data[`delete${typeName}`].data;
      newResults = removeFromResults(previousResults, removedDocument);
      // console.log('** remove **')
      // console.log('removedDocument: ', removedDocument)
      break;

    default:
      // console.log('** no action **')
      return previousResults;
  }

  // console.log('newResults: ', newResults)
  // console.log('\n\n')

  // copy over arrays explicitely to ensure new sort is taken into account
  return {
    [resolverName]: {
      results: [...newResults[resolverName].results],
      totalCount: newResults[resolverName].totalCount,
      __typename: `Multi${typeName}Output`
    }
  };
};
