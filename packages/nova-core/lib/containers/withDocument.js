import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withDocument (options) {
  
  const { queryName, collection, fragment, pollInterval } = options,
        fragmentName = fragment.definitions[0].name.value,
        singleResolverName = collection.options.resolvers.single.name;

  return graphql(gql`
    query ${queryName}($documentId: String, $slug: String) {
      ${singleResolverName}(documentId: $documentId, slug: $slug) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    options(ownProps) {
      return {
        variables: { documentId: ownProps.documentId, slug: ownProps.slug },
        pollInterval: pollInterval || 0, // pollInterval can be set to 0 to disable polling (disabled by default)
      };
    },
    props: returnedProps => {
      const { ownProps, data } = returnedProps;
      return {
        loading: data.networkStatus === 1,
        document: data[singleResolverName],
        fragmentName,
        fragment,
      };
    },
  });
}
