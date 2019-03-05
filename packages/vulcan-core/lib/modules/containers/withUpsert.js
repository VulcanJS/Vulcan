/*

Generic mutation wrapper to upsert a document in a collection.

Sample mutation:

  mutation upsertMovie($input: UpsertMovieInput) {
    upsertMovie(input: $input) {
      data {
        _id
        name
        __typename
      }
      __typename
    }
  }

Arguments:

  - input
    - input.selector: a selector to indicate the document to update
    - input.data: the document (set a field to `null` to delete it)

Child Props:

  - upsertMovie({ selector, data })

*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { upsertClientTemplate } from 'meteor/vulcan:core';
import clone from 'lodash/clone';
import { compose, withHandlers } from 'recompose';
import { extractCollectionInfo, extractFragmentInfo } from './handleOptions';

const withUpsert = options => {
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment, extraVariablesString } = extractFragmentInfo(options, collectionName);

  const typeName = collection.options.typeName;
  const query = gql`
    ${upsertClientTemplate({ typeName, fragmentName, extraVariablesString })}
    ${fragment}
  `;

  const withHandlersOptions = {
    [`upsert${typeName}`]: ({ mutate, ownProps }) => args => {
      const extraVariables = _.pick(ownProps, Object.keys(options.extraVariables || {}))  
      const { selector, data } = args;
      return mutate({
        variables: { selector, data, ...extraVariables }
        // note: updateQueries is not needed for editing documents
      });
    },
    // OpenCRUD backwards compatibility
    upsertMutation: ({ mutate, ownProps }) => args => {
      const { selector, set, unset } = args;
      const extraVariables = _.pick(ownProps, Object.keys(options.extraVariables || {}))  
      const data = clone(set);
      unset &&
        Object.keys(unset).forEach(fieldName => {
          data[fieldName] = null;
        });
      return mutate({
        variables: { selector, data, ...extraVariables }
        // note: updateQueries is not needed for editing documents
      });
    }
  }    

  return compose(
    graphql(query, {alias: `withUpsert${typeName}`}),
    withHandlers(withHandlersOptions)
  )
  
};

export default withUpsert;
