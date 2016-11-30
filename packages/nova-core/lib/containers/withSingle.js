import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withSingle (options) {

  const { queryName, collection, fragment, fragmentName } = options,
        singleResolverName = collection.options.resolvers.single.name;

  return graphql(gql`
    query ${queryName}($documentId: String) {
      ${singleResolverName}(documentId: $documentId) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    options(ownProps) {
      return {
        variables: { documentId: ownProps.documentId },
        pollInterval: 20000,
      };
    },
    props: returnedProps => {
      const { ownProps, data } = returnedProps;
      return {
        loading: data.loading,
        document: data[singleResolverName],
        fragmentName,
        fragment,
      };
    },
  });
}