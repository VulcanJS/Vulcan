/*

Generic mutation wrapper to update a document in a collection. 

Sample mutation: 

  mutation updateMovie($input: UpdateMovieInput) {
    updateMovie(input: $input) {
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

  - updateMovie({ selector, data })
  
*/

import React from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import {
  updateClientTemplate,
  extractCollectionInfo,
  extractFragmentInfo,
} from 'meteor/vulcan:lib';
import { computeQueryVariables } from './variables';

import { multiQueryUpdater } from './create';

export const buildUpdateQuery = ({ typeName, fragmentName, fragment }) => (
  gql`
    ${updateClientTemplate({ typeName, fragmentName })}
    ${fragment}
  `
);

export const useUpdate2 = (options) => {
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);
  const {
    mutationOptions = {}
  } = options;

  const typeName = collection.options.typeName;

  const query = buildUpdateQuery({ typeName, fragmentName, fragment });

  const [updateFunc, ...rest] = useMutation(query, {
    // see https://www.apollographql.com/docs/react/features/error-handling/#error-policies
    errorPolicy: 'all',
    update: multiQueryUpdater({ typeName, fragment, fragmentName, collection, resolverName: `update${typeName}` }),
    ...mutationOptions
  });

  const extendedUpdateFunc = ({ data, ...args }) => {
    return updateFunc({
      variables: {
        data,
        ...computeQueryVariables(options, args)
      },
    });
  };
  return [extendedUpdateFunc, ...rest];
};

export const withUpdate2 = options => C => {
  const { collection } = extractCollectionInfo(options);
  const typeName = collection.options.typeName;
  const funcName = `update${typeName}`;
  const metaName = `update${typeName}Meta`;

  const legacyError = () => {
    throw new Error(`editMutation function has been removed. Use ${funcName} function instead.`);
  };
  const Wrapper = props => {
    const [updateFunc, updateMeta] = useUpdate2(options);
    return <C
      {...props}
      {...{ [funcName]: updateFunc }}
      {...{ [metaName]: updateMeta }}
      editMutation={legacyError}
    />;
  };
  Wrapper.displayName = `withUpdate${typeName}`;
  return Wrapper;
};

export default withUpdate2;
