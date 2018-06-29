import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getSetting, getFragment, getFragmentName, getCollection } from 'meteor/vulcan:core';

export default function withDocument (options) {

  const { collectionName, pollInterval = getSetting('pollInterval', 0), enableCache = false, extraQueries, ssr = false } = options;

  const collection = options.collection || getCollection(collectionName);
  const queryName = options.queryName || `${collection.options.collectionName}SingleQuery`;
  const singleResolverName = collection.options.resolvers.single && collection.options.resolvers.single.name;

  let fragment;

  if (options.fragment) {
    fragment = options.fragment;
  } else if (options.fragmentName) {
    fragment = getFragment(options.fragmentName);
  } else {
    fragment = getFragment(`${collection.options.collectionName}DefaultFragment`);
  }

  const fragmentName = getFragmentName(fragment);

  return graphql(gql`
    query ${queryName}($documentId: String, $slug: String, $enableCache: Boolean) {
      ${singleResolverName}(documentId: $documentId, slug: $slug, enableCache: $enableCache) {
        __typename
        ...${fragmentName}
      }
      ${extraQueries || ''}
    }
    ${fragment}
  `, {
    alias: 'withDocument',

    options({ documentId, slug }) {
      const graphQLOptions = {
        variables: {
          documentId: documentId,
          slug: slug,
          enableCache,
        },
        pollInterval, // note: pollInterval can be set to 0 to disable polling (20s by default)
        ssr,
      };

      if (options.fetchPolicy) {
        graphQLOptions.fetchPolicy = options.fetchPolicy;
      }

      return graphQLOptions;
    },
    props: returnedProps => {
      const { /* ownProps, */ data } = returnedProps;

      const propertyName = options.propertyName || 'document';
      const props = {
        loading: data.loading,
        // document: Utils.convertDates(collection, data[singleResolverName]),
        [ propertyName ]: data[singleResolverName],
        fragmentName,
        fragment,
        data,
      };

      if (data.error) {
        // get graphQL error (see https://github.com/thebigredgeek/apollo-errors/issues/12)
        props.error = data.error.graphQLErrors[0];
      }

      return props;
    },
  });
}
