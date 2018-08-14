/*

Generic mutation wrapper to update a document in a collection. 

Sample mutation: 

  mutation updateMovie($input: UpdateMovieInput) {
    updateMovie(input: $input) {
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
    - input.selector: a selector to indicate the document to update
    - input.data: the document (set a field to `null` to delete it)

Child Props:

  - updateMovie({ selector, data })
  
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName, getCollection, updateClientTemplate } from 'meteor/vulcan:lib';
import clone from 'lodash/clone';

const withUpdate = (options) => {

  const { collectionName } = options;
  // get options
  const collection = options.collection || getCollection(collectionName);
  const fragment = options.fragment || getFragment(options.fragmentName || `${collectionName}DefaultFragment`);
  const fragmentName = getFragmentName(fragment);
  const typeName = collection.options.typeName;
  const query = gql`${updateClientTemplate({ typeName, fragmentName })}${fragment}`;

  return graphql(query, {
    alias: `withUpdate${typeName}`,
    props: ({ ownProps, mutate }) => ({
      [`update${typeName}`]: (args) => {
        const { selector, data } = args;
        return mutate({ 
          variables: { selector, data }
          // note: updateQueries is not needed for editing documents
        });
      },
      // OpenCRUD backwards compatibility
      editMutation: (args) => {
        const { documentId, set, unset } = args;
        const selector = { documentId };
        const data = clone(set);
        unset && Object.keys(unset).forEach(fieldName => {
          data[fieldName] = null;
        });
        return mutate({ 
          variables: { selector, data }
          // note: updateQueries is not needed for editing documents
        });
      }
    }),
  });

}

export default withUpdate;