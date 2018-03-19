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
import { getCollection } from 'meteor/vulcan:core';

export default function withRemove(options) {

  const { collectionName } = options;
  const collection = options.collection || getCollection(collectionName),
        mutationName = collection.options.mutations.remove.name

  return graphql(gql`
    mutation ${mutationName}($documentId: String) {
      ${mutationName}(documentId: $documentId) {
        _id
      }
    }
  `, {
    alias: 'withRemove',
    props: ({ ownProps, mutate }) => ({
      removeMutation: ({ documentId }) => {
        return mutate({ 
          variables: { documentId }
        });
      },
    }),
  });

}