/*

Generic mutation wrapper to remove a document from a collection. 

Sample mutation: 

  mutation deleteMovie($input: DeleteMovieInput) {
    deleteMovie(input: $input) {
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
    - input.selector: the id of the document to remove

Child Props:

  - deleteMovie({ selector })
  
*/

import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { deleteClientTemplate } from 'meteor/vulcan:core';
import { extractCollectionInfo, extractFragmentInfo, getApolloClient } from 'meteor/vulcan:lib';
import { buildMultiQuery } from './multi';
import { getVariablesListFromCache, removeFromData, removeFromDataSingle } from './cacheUpdate';
import { computeQueryVariables } from './variables';
import { singleQuery as singleQueryFn } from './single2';

export const buildDeleteQuery = ({ typeName, fragmentName, fragment }) => (
  gql`
    ${deleteClientTemplate({ typeName, fragmentName })}
    ${fragment}
  `
);

const queryUpdaterCommon = async ({collection, typeName, queryResolverName, query, cache, data, removeDataFunc }) => {
  const deleteResolverName = `delete${typeName}`;
  const removedDoc = data[deleteResolverName].data;
  const variablesList = getVariablesListFromCache(cache, queryResolverName);
  const client = getApolloClient();
  variablesList.forEach(variables => {
    try {
      const queryResult = cache.readQuery({ query: query, variables });
      const newData = removeDataFunc({ queryResult, resolverName: queryResolverName, document: removedDoc });
      client.writeQuery({ query: query, variables, data: newData });
    } catch (err) {
      // could not find the query
      // TODO: be smarter about the error cases and check only for cache mismatch
      console.log(err);
    }
  });
};

// remove value from the cached lists
export const multiQueryUpdater = ({ collection, typeName, fragmentName, fragment }) => async (cache, { data }) => {
  const multiResolverName = collection.options.multiResolverName;
  const multiQuery = buildMultiQuery({ typeName, fragmentName, fragment });
  return await queryUpdaterCommon({collection, typeName, queryResolverName: multiResolverName, query: multiQuery, cache, data, removeDataFunc: removeFromData })
};

export const singleQueryUpdater = ({ collection, typeName, fragmentName, fragment }) => async (cache, { data }) => {
  const singleResolverName = collection.options.singleResolverName;
  const singleQuery = singleQueryFn({ typeName, fragmentName, fragment });
  return await queryUpdaterCommon({collection, typeName, queryResolverName: singleResolverName, query: singleQuery, cache, data, removeDataFunc: removeFromDataSingle })
};

const queryUpdaters = (args) => async (cache, { data }) => {
  await multiQueryUpdater(args)(cache, { data });
  await singleQueryUpdater(args)(cache, { data });
};

export const useDelete2 = (options) => {
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);
  const typeName = collection.options.typeName;
  const {
    //input: optionsInput,
    //_id: optionsId,
    mutationOptions = {},
  } = options;

  const query = buildDeleteQuery({
    fragment,
    fragmentName, typeName
  });

  const [deleteFunc, ...rest] = useMutation(query, {
    // optimistic update
    update: queryUpdaters({ collection, typeName, fragment, fragmentName }),
    ...mutationOptions
  });
  const extendedDeleteFunc = (args/*{ input: argsInput, _id: argsId }*/) => {
    return deleteFunc({
      variables: {
        ...computeQueryVariables(options, args)
      }
    });
  };
  return [extendedDeleteFunc, ...rest];
};

export const withDelete2 = options => C => {
  const { collection } = extractCollectionInfo(options);
  const typeName = collection.options.typeName;
  const funcName = `delete${typeName}`;
  const legacyError = () => {
    throw new Error(`removeMutation function has been removed. Use ${funcName} function instead.`);
  };

  const Wrapper = (props) => {
    const [deleteFunc] = useDelete2(options);
    return (
      <C {...props} {...{ [funcName]: deleteFunc }} removeMutation={legacyError} />
    );
  };
  Wrapper.displayName = `withDelete${typeName}`;
  return Wrapper;
};

export default withDelete2;
