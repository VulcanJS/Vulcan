import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getSetting, singleClientTemplate, Utils } from 'meteor/vulcan:lib';

import { extractCollectionInfo, extractFragmentInfo } from './handleOptions';

export default function withSingle(options) {
  const { pollInterval = getSetting('pollInterval', 0), enableCache = false, extraQueries } = options;

  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);
  const typeName = collection.options.typeName;
  const resolverName = Utils.camelCaseify(typeName);

  // LESSWRONG MODIFICATION: Allow the passing of extraVariables so that you can have field-specific queries
  let extraVariablesString = ''
  if (options.extraVariables) {
    extraVariablesString = Object.keys(options.extraVariables).map(k => `$${k}: ${options.extraVariables[k]}`).join(', ')
  }

  const query = gql`
    ${singleClientTemplate({ typeName, fragmentName, extraQueries, extraVariablesString })}
    ${fragment}
  `;

  return graphql(query, {
    alias: `with${typeName}`,

    options({ documentId, slug, selector = { documentId, slug }, ...rest }) {
      // OpenCrud backwards compatibility
      // From the provided arguments, pick the key-value pairs where the key is also in extraVariables option
      const extraVariables = _.pick(rest, Object.keys(options.extraVariables || {}))  
      const graphQLOptions = {
        variables: {
          input: {
            selector,
            enableCache
          },
          ...extraVariables
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
