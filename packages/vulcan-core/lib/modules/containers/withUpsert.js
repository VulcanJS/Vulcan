/*

Generic mutation wrapper to upsert a document in a collection. 

Sample mutation: 

  mutation upsertMovie($input: UpsertMovieInput) {
    upsertMovie(input: $input) {
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

  - upsertMovie({ selector, data })
  
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName, getCollection, upsertClientTemplate } from 'meteor/vulcan:core';
import clone from 'lodash/clone';

const withUpsert = (options) => {

  const { collectionName } = options;
  // get options
  const collection = options.collection || getCollection(collectionName);
  const fragment = options.fragment || getFragment(options.fragmentName || `${collectionName}DefaultFragment`);
  const fragmentName = getFragmentName(fragment);
  const typeName = collection.options.typeName;
  const query = gql`${upsertClientTemplate({ typeName, fragmentName })}${fragment}`;

  return graphql(query, {
    alias: `withUpsert${typeName}`,
    props: ({ ownProps, mutate }) => ({

      [`upsert${typeName}`]: (args) => {
        const { selector, data } = args;
        return mutate({ 
          variables: { input: { selector, data } }
          // note: updateQueries is not needed for editing documents
        });
      },

      // OpenCRUD backwards compatibility
      upsertMutation: (args) => {
        const { selector, set, unset } = args;
        const data = clone(set);
        unset && Object.keys(unset).forEach(fieldName => {
          data[fieldName] = null;
        });
        return mutate({ 
          variables: { input: { selector, data } }
          // note: updateQueries is not needed for editing documents
        });
      }

    }),
  });

}

export default withUpsert;