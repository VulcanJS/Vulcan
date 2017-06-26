/*
  HoC that allows components to query for the user visit history.
  Adapted from withDocument
*/

import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName } from 'meteor/vulcan:core';

export default function withLastEvent (options) {

  const { pollInterval = 20000 } = options,
        queryName = "LastEventQuery"
        fragment = getFragment("lastEventFragment"),
        fragmentName = getFragmentName(fragment),
        resolverName = "lastEvent"

  return graphql(gql`
    query ${queryName}($documentId: String, $userId: String) {
      ${resolverName}(documentId: $documentId, userId: $userId) {
        __typename
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    alias: 'withLastEvent',

    options(ownProps) {
      return {
        variables: { documentId: ownProps.documentId, userId: ownProps.userId},
        pollInterval, // note: pollInterval can be set to 0 to disable polling (20s by default)
      };
    },
    props: returnedProps => {
      const { ownProps, data } = returnedProps;
      return {
        loading: data.loading,
        // document: Utils.convertDates(collection, data[singleResolverName]),
        event: data[resolverName],
        fragmentName,
        fragment,
      };
    },
  });
}
