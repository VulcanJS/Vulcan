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
import { getFragment, getFragmentName, getCollection, deleteClientTemplate } from 'meteor/vulcan:core';

export default function withDelete(options) {

  const { collectionName } = options;
  const collection = options.collection || getCollection(collectionName),
        fragment = options.fragment || getFragment(options.fragmentName || `${collectionName}DefaultFragment`),
        fragmentName = getFragmentName(fragment),
        typeName = collection.options.typeName,
        query = gql`${deleteClientTemplate({ typeName, fragmentName })}${fragment}`;

  return graphql(query, {
    alias: `withDelete${typeName}`,
    props: ({ ownProps, mutate }) => ({

      [`delete${typeName}`]: (args) => {
        const { selector } = args;
        return mutate({ 
          variables: { input: { selector } }
        });
      },

      // OpenCRUD backwards compatibility
      removeMutation: (args) => {
        const { documentId } = args;
        const selector = { documentId };
        return mutate({ 
          variables: { input: { selector } }
        });
      },

    }),
  });

}