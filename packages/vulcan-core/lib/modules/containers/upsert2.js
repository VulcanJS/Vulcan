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

import React from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { upsertClientTemplate } from 'meteor/vulcan:core';

import { extractCollectionInfo, extractFragmentInfo } from 'meteor/vulcan:lib';

import { multiQueryUpdater } from './create';
import { computeQueryVariables } from './variables';

export const buildUpsertQuery = ({ typeName, fragment, fragmentName }) => (
  gql`
    ${upsertClientTemplate({ typeName, fragmentName })}
    ${fragment}
  `
);
export const useUpsert2 = options => {
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);
  const typeName = collection.options.typeName;
  const {
    mutationOptions = {}
  } = options;

  const query = buildUpsertQuery({ typeName, fragmentName, fragment });
  const resolverName = `upsert${typeName}`;
  const [upsertFunc, ...rest] = useMutation(query, {
    errorPolicy: 'all',
    // we reuse the update function create, which should actually support
    // upserting
    update: multiQueryUpdater({ typeName, fragment, fragmentName, collection, resolverName }),
    ...mutationOptions
  });

  const extendedUpsertFunc = ({ data, ...args }) => {
    return upsertFunc({
      variables: {
        data,
        ...computeQueryVariables(options, args)
      }
    });
  };

  return [extendedUpsertFunc, ...rest];
};

export const withUpsert2 = options => C => {
  const { collection } = extractCollectionInfo(options);
  const typeName = collection.options.typeName;

  const funcName = `upsert${typeName}`;
  const legacyError = () => {
    throw new Error(`upsertMutation function has been removed. Use ${funcName} function instead.`);
  };

  const Wrapper = props => {
    const [upsertFunc] = useUpsert2(options);
    return (
      <C {...props} {...{ [funcName]: upsertFunc }} upsertMutation={legacyError} />

    );

  };

  Wrapper.displayName = `withUpsert${typeName}`;
  return Wrapper;
};

export default withUpsert2;
