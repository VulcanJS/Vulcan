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
import { getFragment, getFragmentName, getCollection } from 'meteor/vulcan:core';

export default function withUpsert(options) {

  const { collectionName } = options;
  // get options
  const collection = options.collection || getCollection(collectionName),
        fragment = options.fragment || getFragment(options.fragmentName),
        fragmentName = getFragmentName(fragment),
        typeName = collection.options.typeName;

  return graphql(gql`
    mutation upsert${typeName}($search: JSON, $set: ${collectionName}Input, $unset: ${collectionName}Unset) {
      upsert${typeName}(search: $search, set: $set, unset: $unset) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    alias: `withUpsert${typeName}`,
    props: ({ ownProps, mutate }) => ({
      upsertMutation: ({ search, set, unset }) => {
        return mutate({
          variables: { search, set, unset }
        });
      }
    }),
  });

}
