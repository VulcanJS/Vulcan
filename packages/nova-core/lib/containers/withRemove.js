/*

Generic mutation wrapper to remove a document from a collection. 

Sample mutation: 

  mutation moviesRemove($documentId: String) {
    moviesEdit(documentId: $documentId) {
      ...MoviesRemoveFormFragment
    }
  }

Arguments: 

  - documentId: the id of the document to remove

Child Props:

  - removeMutation(documentId)
  
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';

export default function withRemove(options) {

  const { collection, fragmentName, fragment } = options,
        mutationName = collection.options.mutations.remove.name,
        listResolverName = collection.options.resolvers.list.name,
        totalResolverName = collection.options.resolvers.total.name;

  return graphql(gql`
    mutation ${mutationName}($documentId: String) {
      ${mutationName}(documentId: $documentId) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    props: ({ ownProps, mutate }) => ({
      removeMutation: ({ documentId }) => {

        const updateQueries = {
          [props.queryName]: (prev, { mutationResult }) => {
            // filter the list to get a new one without the document
            const listWithoutDocument = prev[listResolverName].filter(doc => doc._id !== documentId);
            // update the query
            const newList = update(prev, {
              [listResolverName]: { $set: listWithoutDocument }, // ex: postsList
              [totalResolverName]: { $set: prev.postsListTotal - 1 } // ex: postsListTotal
            });
            return newList;
          }
        }

        return mutate({ 
          variables: { documentId },
          // updateQueries: props.updateQueries || updateQueries
        })
      },
    }),
  });

}