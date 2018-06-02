/*

Generic mutation wrapper to edit a document in a collection. 

Sample mutation: 

  mutation updateMovie($documentId: String, $set: MoviesInput, $unset: MoviesUnset) {
    updateMovie(documentId: $documentId, set: $set, unset: $unset) {
      ...MovieFormFragment
    }
  }

Arguments: 

  - documentId: the id of the document to modify
  - set: an object containing all the fields to modify and their new values
  - unset: an object containing the fields to unset

Child Props:

  - updateMovie(documentId, set, unset)
  
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName, getCollection } from 'meteor/vulcan:lib';

export default function withUpdate(options) {

  const { collectionName } = options;
  // get options
  const collection = options.collection || getCollection(collectionName),
        fragment = options.fragment || getFragment(options.fragmentName),
        fragmentName = getFragmentName(fragment),
        mutationName = collection.options.mutations.update.name,
        typeName = collection.options.typeName;

  return graphql(gql`
    mutation ${mutationName}($documentId: String, $set: ${collection.options.collectionName}Input, $unset: ${collection.options.collectionName}Unset) {
      ${mutationName}(documentId: $documentId, set: $set, unset: $unset) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    alias: `withUpdate${typeName}`,
    props: ({ ownProps, mutate }) => ({
      [`update${typeName}`]: (args) => {
        const { documentId, set, unset } = args;
        return mutate({ 
          variables: { documentId, set, unset }
          // note: updateQueries is not needed for editing documents
        });
      },
      // OpenCRUD backwards compatibility
      editMutation: (args) => {
        const { documentId, set, unset } = args;
        return mutate({ 
          variables: { documentId, set, unset }
          // note: updateQueries is not needed for editing documents
        });
      }
    }),
  });

}