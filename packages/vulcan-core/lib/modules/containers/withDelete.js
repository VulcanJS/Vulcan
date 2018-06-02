/*

Generic mutation wrapper to remove a document from a collection. 

Sample mutation: 

  mutation deleteMovie($documentId: String) {
    deleteMovie(documentId: $documentId) {
      ...MovieFormFragment
    }
  }

Arguments: 

  - documentId: the id of the document to remove

Child Props:

  - deleteMovie(documentId)
  
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getCollection } from 'meteor/vulcan:core';

export default function withDelete(options) {

  const { collectionName } = options;
  const collection = options.collection || getCollection(collectionName),
        mutationName = collection.options.mutations.delete.name,
        typeName = collection.options.typeName;

  return graphql(gql`
    mutation ${mutationName}($documentId: String) {
      ${mutationName}(documentId: $documentId) {
        _id
      }
    }
  `, {
    alias: `withDelete${typeName}`,
    props: ({ ownProps, mutate }) => ({
      [`delete${typeName}`]: ({ documentId }) => {
        return mutate({ 
          variables: { documentId }
        });
      },
      // OpenCRUD backwards compatibility
      removeMutation: ({ documentId }) => {
        return mutate({ 
          variables: { documentId }
        });
      },
    }),
  });

}