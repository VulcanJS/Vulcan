/*

Generic mutation wrapper to insert a new document in a collection and update
a related query on the client with the new item and a new total item count. 

Sample mutation: 

  mutation moviesNew($document: MoviesInput) {
    moviesNew(document: $document) {
      ...MoviesNewFormFragment
    }
  }

Arguments: 

  - document: the document to insert

Child Props:

  - newMutation(document)
    
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName, getCollection } from 'meteor/vulcan:core';

export default function withNew(options) {

  const { collectionName } = options;
  // get options
  const collection = options.collection || getCollection(collectionName),
        fragment = options.fragment || getFragment(options.fragmentName),
        fragmentName = getFragmentName(fragment),
        mutationName = collection.options.mutations.new.name;

  // wrap component with graphql HoC
  return graphql(gql`
    mutation ${mutationName}($document: ${collection.options.collectionName}Input) {
      ${mutationName}(document: $document) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    alias: 'withNew',
    props: ({ownProps, mutate}) => ({
      newMutation: ({document}) => {
        return mutate({ 
          variables: { document },
        });
      }
    }),
  });

}