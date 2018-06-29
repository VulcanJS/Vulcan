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

  let { collection, collectionName } = options;
  if (!collection) {
    collection = getCollection(collectionName);
  }
  const fragment = options.fragment || getFragment(options.fragmentName);
  const fragmentName = getFragmentName(fragment);
  collectionName = collection.options.collectionName;
  const mutationName = collection.options.mutations.upsert.name;

  return graphql(gql`
    mutation ${mutationName}($search: JSON, $set: ${collectionName}Input, $unset: ${collectionName}Unset) {
      ${mutationName}(search: $search, set: $set, unset: $unset) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    alias: 'withUpsert',
    options: () => ({
      ssr: false,
    }),
    props: ({ ownProps, mutate }) => ({
      upsertMutation: ({ search, set, unset }) => {
        return mutate({
          variables: { search, set, unset }
        });
      }
    }),
  });

}
