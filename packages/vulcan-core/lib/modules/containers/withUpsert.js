/*

 Generic mutation wrapper to upsert a document in a collection.

 Sample mutation:

  mutation moviesUpsert($search: JSON, $set: MoviesInput, $unset: MoviesUnset) {
    moviesUpsert(search: $search, set: $set, unset: $unset) {
      ...MoviesUpsertFormFragment
    }
  }

 Arguments:

 - search: the search fields to match on in the database
 - set: an object containing all the fields to modify and their new values
 - unset: an object containing the fields to unset

 Child Props:

 - upsertMutation(search, set, unset)

 */

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName, getCollection, upsertClientTemplate } from 'meteor/vulcan:core';
import clone from 'lodash/clone';

export default function withUpsert(options) {

  const { collectionName } = options;
  // get options
  const collection = options.collection || getCollection(collectionName),
        fragment = options.fragment || getFragment(options.fragmentName || `${collectionName}DefaultFragment`),
        fragmentName = getFragmentName(fragment),
        typeName = collection.options.typeName,
        query = gql`${upsertClientTemplate({ typeName, fragmentName })}${fragment}`;

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
        const { search, set, unset } = args;
        const selector = { search };
        const data = clone(set);
        Object.keys(unset).forEach(fieldName => {
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
