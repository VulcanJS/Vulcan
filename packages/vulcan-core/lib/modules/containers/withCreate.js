/*

Generic mutation wrapper to insert a new document in a collection and update
a related query on the client with the new item and a new total item count. 

Sample mutation: 

  mutation createMovie($data: CreateMovieData) {
    createMovie(data: $data) {
      data {
        _id
        name
        __typename
      }
      __typename
    }
  }

Arguments: 

  - data: the document to insert

Child Props:

  - createMovie({ data })
    
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { createClientTemplate } from 'meteor/vulcan:core';
import { extractCollectionInfo, extractFragmentInfo } from './handleOptions';
import { compose, withHandlers } from 'recompose';

const withCreate = options => {
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment, extraVariablesString } = extractFragmentInfo(options, collectionName);

  const typeName = collection.options.typeName;
  const query = gql`
    ${createClientTemplate({ typeName, fragmentName, extraVariablesString })}
    ${fragment}
  `;

  const withHandlersOptions = {
    [`create${typeName}`]: ({ mutate, ownProps }) => args => {
      const extraVariables = _.pick(ownProps, Object.keys(options.extraVariables || {}))  
      const { data } = args;
      return mutate({
        variables: { data, ...extraVariables }
      });
    },
    // OpenCRUD backwards compatibility
    newMutation: ({ mutate, ownProps }) => args => {
      const extraVariables = _.pick(ownProps, Object.keys(options.extraVariables || {}))  
      const { document } = args;
      return mutate({
        variables: { data: document, ...extraVariables}
      });
    }
  }    

  // wrap component with graphql HoC
  return compose(
    graphql(query, {alias: `withCreate${typeName}`}),
    withHandlers(withHandlersOptions)
  )
};

export default withCreate;
