import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withDocument (options) {
  
  const { queryName, collection, fragment, pollInterval = 20000 } = options,
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
        loading: data.networkStatus === 1,
        document: Utils.convertDates(collection, data[singleResolverName]),
        fragmentName,
        fragment,
      };
    },
  });
}
