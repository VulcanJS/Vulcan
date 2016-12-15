import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { getSetting } from 'meteor/nova:core';
import Mingo from 'mingo';

export default function withList (options) {

  const { queryName, collection, fragment, limit = getSetting('postsPerPage', 10) } = options,
        fragmentName = fragment.definitions[0].name.value,
        listResolverName = collection.options.resolvers.list.name,
        totalResolverName = collection.options.resolvers.total.name;

  return graphql(gql`
    query ${queryName}($terms: Terms, $offset: Int, $limit: Int) {
      ${totalResolverName}(terms: $terms)
      ${listResolverName}(terms: $terms, offset: $offset, limit: $limit) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    options(ownProps) {
      return {
        variables: {
          terms: ownProps.terms || {},
          offset: 0,
          limit: limit
        },
        reducer: (previousResults, action) => {

          const newMutationName = `${collection._name}New`;
          const editMutationName = `${collection._name}Edit`;
          const removeMutationName = `${collection._name}Remove`;

          const viewName = ownProps.terms && ownProps.terms.view;

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

          let newResults = previousResults;

          if (viewName && collection.views && collection.views[viewName]) {

            // scenario 1: we are filtering by a specific view
            const view = collection.views[ownProps.terms.view](ownProps.terms);
            const mingoQuery = Mingo.Query(view.selector);

            switch (action.operationName) {

              case newMutationName:
                // if new document belongs to current list (based on view selector), add it
                const newDocument = action.result.data[newMutationName];
                if (mingoQuery.test(newDocument)) {
                  newResults = addToResults(previousResults, newDocument);
                }
                break;

              case editMutationName:
                // if edited doesn't belong to current list anymore (based on view selector), remove it
                const editedDocument = action.result.data[editMutationName];
                if (!mingoQuery.test(editedDocument)) {
                  newResults = removeFromResults(previousResults, editedDocument);
                }
                break;

              case removeMutationName:
                const removedDocument = action.result.data[removeMutationName];
                newResults = removeFromResults(previousResults, removedDocument);
                break;
            }

          } else {
          // scenario 2: we aren't filtering

            switch (action.operationName) {

              case newMutationName:
                // always add
                const newDocument = action.result.data[newMutationName];
                newResults = addToResults(previousResults, newDocument);
                break;

              case editMutationName:
                // do nothing
                break;

              case removeMutationName:
                // always remove
                const removedDocument = action.result.data[removeMutationName];
                newResults = removeFromResults(previousResults, removedDocument);
                break;
            }
          }
          
          // console.log('// withList reducer')
          // console.log(previousResults)
          // console.log(action)
          // console.log(newResults)

          return newResults;
        },
        // pollInterval: 20000,
      };
    },
    props(props) {
      
      // console.log('// withList props')
      // console.log(props)

      const loading = props.data.loading,
            fetchMore = props.data.fetchMore,
            refetch = props.data.refetch,
            results = props.data[listResolverName],
            totalCount = props.data[totalResolverName],
            networkStatus = props.data.networkStatus;

      return {
        loading,
        results,
        totalCount,
        refetch,
        networkStatus,
        count: results && results.length,
        loadMore(variables) {

          // get variables passed as argument or else just default to incrementing the offset
          variables = typeof variables === 'undefined' ? { offset: results.length } : variables;

          return fetchMore({
            variables,
            updateQuery(previousResults, { fetchMoreResult }) {
              // no more post to fetch
              if (!fetchMoreResult.data) {
                return previousResults;
              }
              const newResults = {};
              newResults[listResolverName] = [...previousResults[listResolverName], ...fetchMoreResult.data[listResolverName]];
              // return the previous results "augmented" with more
              return {...previousResults, ...newResults };
            },
          });
        },
        fragmentName,
        fragment,
        ...props.ownProps // pass on the props down to the wrapped component
      };
    },
  });
}