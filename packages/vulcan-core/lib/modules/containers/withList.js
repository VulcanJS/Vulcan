/*

### withList

Paginated items container

Options: 

  - queryName: an arbitrary name for the query
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
import { getSetting, getFragment, getFragmentName, getCollection } from 'meteor/vulcan:core';
import Mingo from 'mingo';
import compose from 'recompose/compose';
import withState from 'recompose/withState';

const withList = (options) => {

  // console.log(options)
  
  const {
    collectionName,
    limit = 10,
    pollInterval = getSetting('pollInterval', 20000),
    totalResolver = true,
    enableCache = false,
    extraQueries,
  } = options;
  
  const collection = options.collection || getCollection(collectionName);
  
  const queryName = options.queryName || `${collection.options.collectionName}ListQuery`;
  const listResolverName = collection.options.resolvers.list && collection.options.resolvers.list.name;
  const totalResolverName = collection.options.resolvers.total && collection.options.resolvers.total.name;

  let fragment;

  if (options.fragment) {
    fragment = options.fragment;
  } else if (options.fragmentName) {
    fragment = getFragment(options.fragmentName);
  } else {
    fragment = getFragment(`${collection.options.collectionName}DefaultFragment`);
  }

  const fragmentName = getFragmentName(fragment);

  // build graphql query from options
  const query = gql`
    query ${queryName}($terms: JSON, $enableCache: Boolean) {
      ${totalResolver ? `${totalResolverName}(terms: $terms, enableCache: $enableCache)` : ``}
      ${listResolverName}(terms: $terms, enableCache: $enableCache) {
        __typename
        ...${fragmentName}
      }
      ${extraQueries || ''}
    }
    ${fragment}
  `;

  return compose(

    // wrap component with Apollo HoC to give it access to the store
    withApollo, 

    // wrap component with HoC that manages the terms object via its state
    withState('paginationTerms', 'setPaginationTerms', props => {

      // get initial limit from props, or else options
      const paginationLimit = props.terms && props.terms.limit || limit;
      const paginationTerms = {
        limit: paginationLimit, 
        itemsPerPage: paginationLimit, 
      };
      
      return paginationTerms;
    }),

    // wrap component with graphql HoC
    graphql(

      query,

      {
        alias: 'withList',
        
        // graphql query options
        options({terms, paginationTerms, client: apolloClient, currentUser}) {
          // get terms from options, then props, then pagination
          const mergedTerms = {...options.terms, ...terms, ...paginationTerms};

          const graphQLOptions = {
            variables: {
              terms: mergedTerms,
              enableCache,
            },
            // note: pollInterval can be set to 0 to disable polling (20s by default)
            pollInterval,
            reducer: (previousResults, action) => {

              // see queryReducer function defined below
              return queryReducer(previousResults, action, collection, mergedTerms, listResolverName, totalResolverName, queryName, apolloClient);
            
            },
          };

          if (options.fetchPolicy) {
            graphQLOptions.fetchPolicy = options.fetchPolicy
          }

          // set to true if running into https://github.com/apollographql/apollo-client/issues/1186
          if (options.notifyOnNetworkStatusChange) {
            graphQLOptions.notifyOnNetworkStatusChange = options.notifyOnNetworkStatusChange
          }
          
          return graphQLOptions;
        },

        // define props returned by graphql HoC
        props(props) {

          // see https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
          const refetch = props.data.refetch,
                // results = Utils.convertDates(collection, props.data[listResolverName]),
                results = props.data[listResolverName],
                totalCount = props.data[totalResolverName],
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
            [ propertyName ]: results,
            totalCount,
            refetch,
            networkStatus,
            error,
            count: results && results.length,

            // regular load more (reload everything)
            loadMore(providedTerms) {
              // if new terms are provided by presentational component use them, else default to incrementing current limit once
              const newTerms = typeof providedTerms === 'undefined' ? { /*...props.ownProps.terms,*/ ...props.ownProps.paginationTerms, limit: results.length + props.ownProps.paginationTerms.itemsPerPage } : providedTerms;
              
              props.ownProps.setPaginationTerms(newTerms);
            },

            // incremental loading version (only load new content)
            // note: not compatible with polling
            loadMoreInc(providedTerms) {

              // get terms passed as argument or else just default to incrementing the offset
              const newTerms = typeof providedTerms === 'undefined' ? { ...props.ownProps.terms, ...props.ownProps.paginationTerms, offset: results.length } : providedTerms;
              
              return props.data.fetchMore({
                variables: { terms: newTerms }, // ??? not sure about 'terms: newTerms'
                updateQuery(previousResults, { fetchMoreResult }) {
                  // no more post to fetch
                  if (!fetchMoreResult.data) {
                    return previousResults;
                  }
                  const newResults = {};
                  newResults[listResolverName] = [...previousResults[listResolverName], ...fetchMoreResult.data[listResolverName]];
                  // return the previous results "augmented" with more
                  return {...previousResults, ...newResults};
                },
              });
            },

            fragmentName,
            fragment,
            ...props.ownProps, // pass on the props down to the wrapped component
            data: props.data,
          };
        },
      }
    )
  );
}


// define query reducer separately
const queryReducer = (previousResults, action, collection, mergedTerms, listResolverName, totalResolverName, queryName, apolloClient) => {

  // if collection has no mutations defined, just return previous results
  if (!collection.options.mutations) {
    return previousResults;
  }

  const newMutationName = collection.options.mutations.new && collection.options.mutations.new.name;
  const editMutationName = collection.options.mutations.edit && collection.options.mutations.edit.name;
  const removeMutationName = collection.options.mutations.remove && collection.options.mutations.remove.name;

  let newResults = previousResults;

  // get mongo selector and options objects based on current terms
  const result = collection.getParameters(mergedTerms, apolloClient);
  const { selector, options } = result;

  const mingoQuery = new Mingo.Query(selector);

  // function to remove a document from a results object, used by edit and remove cases below
  const removeFromResults = (results, document) => {
    const listWithoutDocument = results[listResolverName].filter(doc => doc._id !== document._id);
    const newResults = update(results, {
      [listResolverName]: { $set: listWithoutDocument }, // ex: postsList
      [totalResolverName]: { $set: results[totalResolverName] - 1 } // ex: postsListTotal
    });
    return newResults;
  }

  // add document to a results object
  const addToResults = (results, document) => {

    return update(results, {
      [listResolverName]: { $unshift: [document] },
      [totalResolverName]: { $set: results[totalResolverName] + 1 }
    });
  }

  // reorder results according to a sort
  const reorderResults = (results, sort) => {
    const list = results[listResolverName];
    // const convertedList = Utils.convertDates(collection, list); // convert date strings to date objects
    const convertedList = list;
    const cursor = mingoQuery.find(convertedList);
    const sortedList = cursor.sort(sort).all();
    results[listResolverName] = sortedList;
    return results;
  }

  // console.log('// withList reducer');
  // console.log('queryName: ', queryName);
  // console.log('terms: ', mergedTerms);
  // console.log('selector: ', selector);
  // console.log('options: ', options);
  // console.log('previousResults: ', previousResults);
  // console.log('previous titles: ', _.pluck(previousResults[listResolverName], 'title'))
  // console.log('action: ', action);

  switch (action.operationName) {

    case newMutationName:
      // if new document belongs to current list (based on view selector), add it
      const newDocument = action.result.data[newMutationName];
      if (mingoQuery.test(newDocument)) {
        newResults = addToResults(previousResults, newDocument);
        newResults = reorderResults(newResults, options.sort);
      }
      // console.log('** new **')
      // console.log('newDocument: ', newDocument)
      // console.log('belongs to list: ', mingoQuery.test(newDocument))
      break;

    case editMutationName:
      const editedDocument = action.result.data[editMutationName];
      if (mingoQuery.test(editedDocument)) {
        // edited document belongs to the list
        if (!_.findWhere(previousResults[listResolverName], {_id: editedDocument._id})) {
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
      // console.log('exists in list: ', !!_.findWhere(previousResults[listResolverName], {_id: editedDocument._id}))
      break;

    case removeMutationName:
      const removedDocument = action.result.data[removeMutationName];
      newResults = removeFromResults(previousResults, removedDocument);
      // console.log('** remove **')
      // console.log('removedDocument: ', removedDocument)
      break;

    default: 
      // console.log('** no action **')
      return previousResults;
  }

  // console.log('newResults: ', newResults)
  // console.log('new titles: ', _.pluck(newResults[listResolverName], 'title'))
  // console.log('\n\n')

  // copy over arrays explicitely to ensure new sort is taken into account
  return {
    [listResolverName]: [...newResults[listResolverName]],
    [totalResolverName]: newResults[totalResolverName],
  }

}

export default withList;
