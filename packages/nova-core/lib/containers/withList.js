import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';

export default function withList (options) {

  const { queryName, collection, fragment } = options,
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
          limit: 5
        },
        reducer: (previousResults, action) => {

          const newMutationName = `${collection._name}New`;
          const editMutationName = `${collection._name}Edit`;
          const removeMutationName = `${collection._name}Remove`;

          let newResults = previousResults;

          switch (action.operationName) {

            case newMutationName:
              const newDocument = action.result.data[newMutationName];
              newResults = update(previousResults, {
                [listResolverName]: { $unshift: [newDocument] },
                [totalResolverName]: { $set: previousResults[totalResolverName] + 1 }
              });
              break;

            case editMutationName:
              // do nothing
              break;

            case removeMutationName:
              const listWithoutDocument = previousResults[listResolverName].filter(doc => doc._id !== action.result.data[removeMutationName]._id);
              newResults = update(previousResults, {
                [listResolverName]: { $set: listWithoutDocument }, // ex: postsList
                [totalResolverName]: { $set: previousResults[totalResolverName] - 1 } // ex: postsListTotal
              });
              break;
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
      
      const loading = props.data.loading,
            fetchMore = props.data.fetchMore,
            refetch = props.data.refetch,
            results = props.data[listResolverName],
            totalCount = props.data[totalResolverName];

      return {
        loading,
        results,
        totalCount,
        refetch,
        count: results && results.length,
        loadMore(event) {
          event.preventDefault();
          // basically, rerun the query 'getPostsList' with a new offset
          return fetchMore({
            variables: { offset: results.length },
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