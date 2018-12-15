import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getSetting, singleClientTemplate, Utils, extractCollectionInfo, extractFragmentInfo } from 'meteor/vulcan:lib';

export default function withSingle(options) {
  const { pollInterval = getSetting('pollInterval', 20000), enableCache = false, extraQueries } = options;

  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);
  const typeName = collection.options.typeName;
  const resolverName = Utils.camelCaseify(typeName);

  const query = gql`
    ${singleClientTemplate({ typeName, fragmentName, extraQueries })}
    ${fragment}
  `;

  return graphql(query, {
    alias: `with${typeName}`,

    options({ documentId, slug, selector = { documentId, slug } }) {
      // OpenCrud backwards compatibility
      const graphQLOptions = {
        variables: {
          input: {
            selector,
            enableCache
          }
        },
        pollInterval // note: pollInterval can be set to 0 to disable polling (20s by default)
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
        refetch: data.refetch,
        // document: Utils.convertDates(collection, data[singleResolverName]),
        [propertyName]: data[resolverName] && data[resolverName].result,
        fragmentName,
        fragment,
        data
      };

      if (data.error) {
        // get graphQL error (see https://github.com/thebigredgeek/apollo-errors/issues/12)
        props.error = data.error.graphQLErrors[0];
      }

      return props;
    }
  });
}
