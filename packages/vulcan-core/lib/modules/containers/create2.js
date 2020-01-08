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

import React from 'react';
import gql from 'graphql-tag';
import { createClientTemplate } from 'meteor/vulcan:core';
import { extractCollectionInfo, extractFragmentInfo, filterFunction, getApolloClient } from 'meteor/vulcan:lib';
import { useMutation } from '@apollo/react-hooks';
import { buildMultiQuery } from './multi';
import { addToData, getVariablesListFromCache, matchSelector, addToDataSingle } from './cacheUpdate';
import { singleQuery as singleQueryFn } from './single2';

export const buildCreateQuery = ({ typeName, fragmentName, fragment }) => {
  const query = gql`
    ${createClientTemplate({ typeName, fragmentName })}
    ${fragment}
  `;
  return query;
};

const queryUpdaterCommon = async ({collection, typeName, queryResolverName, query, cache, data, addDataFunc }) => {
  const resolverName = `create${typeName}`;
  const newDoc = data[resolverName].data;
  const client = getApolloClient();
  const variablesList = getVariablesListFromCache(cache, queryResolverName);
  const queryUpdates = (await Promise.all(
  variablesList
    .map(async variables => {
      try {
        const queryResult = cache.readQuery({ query: query, variables });
        // get mongo selector and options objects based on current terms
        const input = variables.input;
        // TODO: the 3rd argument is the context, not available here
        // Maybe we could pass the currentUser? The context is passed to custom filters function
        const filter = await filterFunction(collection, input, {});
        const { selector, options: paramOptions } = filter;
        const { sort } = paramOptions;
        // check if the document should be included in this query, given the query filters
        if (matchSelector(newDoc, selector)) {
          // TODO: handle order using the selector
          const newData = addDataFunc({ queryResult, resolverName: queryResolverName, document: newDoc, sort, selector });
          // memorize updates just in case
          return { query: query, variables, data: newData };
        }
      } catch (err) {
        // could not find the query
        // TODO: be smarter about the error cases and check only for cache mismatch
        console.log(err);
      }
    })
  )
  ).filter(x => !!x); // filter out null values
  // apply updates to the client
  queryUpdates.forEach((update) => {
    client.writeQuery(update);
  });
  // return for potential chainging
  return queryUpdates;
};

/**
 * Update cached list of data after a document creation
 */
export const multiQueryUpdater = ({ collection, typeName, fragmentName, fragment }) => async (cache, { data }) => {
  const multiResolverName = collection.options.multiResolverName;
  const multiQuery = buildMultiQuery({ typeName, fragmentName, fragment });
  return await queryUpdaterCommon({collection, typeName, queryResolverName: multiResolverName, query: multiQuery, cache, data, addDataFunc: addToData })
};

export const singleQueryUpdater = ({ collection, typeName, fragmentName, fragment }) => async (cache, { data }) => {
  const singleResolverName = collection.options.singleResolverName;
  const singleQuery = singleQueryFn({ typeName, fragmentName, fragment });
  return await queryUpdaterCommon({collection, typeName, queryResolverName: singleResolverName, query: singleQuery, cache, data, addDataFunc: addToDataSingle })
};

const queryUpdaters = (args) => async (cache, { data }) => {
  await multiQueryUpdater(args)(cache, { data });
  await singleQueryUpdater(args)(cache, { data });
};

const buildResult = (options, resolverName, executionResult) => {
  const { data } = executionResult;
  const propertyName = options.propertyName || 'document';
  const props = {
    ...executionResult,
    [propertyName]: data && data[resolverName] && data[resolverName].data,
  };
  return props;
};

const extendUpdateFunc = (originalUpdate, options, resolverName) => {
  const propertyName = options.propertyName || 'document';
  return (cache, executionResult) => {
    const {data} = executionResult;
    executionResult.extensions = {
      ...executionResult.extensions,
      [propertyName]: data && data[resolverName] && data[resolverName].data,
    }
    return originalUpdate(cache, executionResult);
  }
}

export const useCreate2 = (options) => {
  const { mutationOptions = {} } = options;
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);

  const typeName = collection.options.typeName;

  const query = buildCreateQuery({ typeName, fragmentName, fragment });

  const resolverName = `create${typeName}`;

  if (mutationOptions.update) {
    mutationOptions.update = extendUpdateFunc(mutationOptions.update, options, resolverName);
  } else {
    mutationOptions.update = queryUpdaters({ typeName, fragment, fragmentName, collection });
  }

  const [createFunc, ...rest] = useMutation(query, mutationOptions);

  // so the syntax is useCreate({collection: ...}, {data: ...})
  const extendedCreateFunc = async (args) => {
    const executionResult = await createFunc({
      variables: { data: args.data },
    });
    return buildResult(options, resolverName, executionResult);
  };
  return [extendedCreateFunc, ...rest];
};

export const withCreate2 = options => C => {
  const { collection } = extractCollectionInfo(options);
  const typeName = collection.options.typeName;
  const funcName = `create${typeName}`;
  const legacyError = () => {
    throw new Error(`newMutation function has been removed. Use ${funcName} instead.`);
  };
  const Wrapper = props => {
    const [createFunc] = useCreate2(options);
    return <C
      {...props}
      {...{ [funcName]: createFunc }}
      newMutation={legacyError}
    />;
  };

  Wrapper.displayName = `withCreate${typeName}`;
  return Wrapper;
};

export default withCreate2;
