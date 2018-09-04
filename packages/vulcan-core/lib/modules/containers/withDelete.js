/*

Generic mutation wrapper to remove a document from a collection. 

Sample mutation: 

  mutation deleteMovie($input: DeleteMovieInput) {
    deleteMovie(input: $input) {
      data {
        _id
        name
        __typename
      }
      __typename
    }
  }

Arguments: 

  - input
    - input.selector: the id of the document to remove

Child Props:

  - deleteMovie({ selector })
  
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName, getCollection, deleteClientTemplate } from 'meteor/vulcan:core';

const withDelete = (options) => {

  const collectionName = options.collectionName || options.collection.options.collectionName
  const collection = options.collection || getCollection(collectionName);
  const typeName = collection.options.typeName;

  let fragment
  if (options.fragment) {
    fragment = options.fragment;
  } else if (options.fragmentName) {
    fragment = getFragment(options.fragmentName);
  } else {
    fragment = getFragment(`${collection.options.collectionName}DefaultFragment`);
  }
  const fragmentName = getFragmentName(fragment);

  const query = gql`${deleteClientTemplate({ typeName, fragmentName })}${fragment}`;


  return graphql(query, {
    alias: `withDelete${typeName}`,
    props: ({ ownProps, mutate }) => ({

      [`delete${typeName}`]: (args) => {
        const { selector } = args;
        return mutate({
          variables: { selector }
        });
      },

      // OpenCRUD backwards compatibility
      removeMutation: (args) => {
        const { documentId } = args;
        const selector = { documentId };
        return mutate({
          variables: { selector }
        });
      },

    }),
  });
}

export default withDelete;