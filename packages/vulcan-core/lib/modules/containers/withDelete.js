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

  const { collectionName } = options;
  const collection = options.collection || getCollection(collectionName);
  const fragment = options.fragment || getFragment(options.fragmentName || `${collectionName}DefaultFragment`);
  const fragmentName = getFragmentName(fragment);
  const typeName = collection.options.typeName;
  const query = gql`${deleteClientTemplate({ typeName, fragmentName })}${fragment}`;

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

export default withDelete;