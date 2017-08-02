import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName } from 'meteor/vulcan:core';

export default function withDocument (options) {
  
  const { collection, pollInterval = 20000 } = options,
        queryName = options.queryName || `${collection.options.collectionName}SingleQuery`,
        singleResolverName = collection.options.resolvers.single && collection.options.resolvers.single.name;

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
    query ${queryName}($documentId: String, $slug: String) {
      ${singleResolverName}(documentId: $documentId, slug: $slug) {
        __typename
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    alias: 'withDocument',
    
    options(ownProps) {
      return {
        variables: { documentId: ownProps.documentId, slug: ownProps.slug },
        pollInterval, // note: pollInterval can be set to 0 to disable polling (20s by default)
      };
    },
    props: returnedProps => {
      const { ownProps, data } = returnedProps;
      return {
        loading: data.loading,
        // document: Utils.convertDates(collection, data[singleResolverName]),
        document: data[singleResolverName],
        fragmentName,
        fragment,
      };
    },
  });
}
