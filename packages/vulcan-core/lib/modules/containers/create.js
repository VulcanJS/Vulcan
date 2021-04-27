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
import { extractCollectionInfo, extractFragmentInfo, filterFunction } from 'meteor/vulcan:lib';
import { useMutation } from '@apollo/client';
import { buildMultiQuery } from './multi';
import { addToData, getVariablesListFromCache, matchSelector } from './cacheUpdate';

export const buildCreateQuery = ({ typeName, fragmentName, fragment }) => {
  const query = gql`
    ${createClientTemplate({ typeName, fragmentName })}
    ${fragment}
  `;
  return query;
};

/**
 * Update cached list of data after a document creation
 */
export const multiQueryUpdater = ({
  typeName,
  fragment,
  fragmentName,
  collection,
  resolverName
}) => (cache, { data }) => {
  const multiResolverName = collection.options.multiResolverName;
  // update multi queries
  const multiQuery = buildMultiQuery({ typeName, fragmentName, fragment });
  const newDoc = data?.[resolverName]?.data;
  // get all the resolvers that match
  const variablesList = getVariablesListFromCache(cache, multiResolverName);
  variablesList.forEach(async variables => {
    try {
      const queryResult = cache.readQuery({ query: multiQuery, variables });
      // get mongo selector and options objects based on current terms
      const terms = variables.input.terms;
      const parameters = terms ? collection.getParameters(terms) : await filterFunction(collection, variables.input, {});
      const { selector, options: paramOptions } = parameters;
      const { sort } = paramOptions;
      // check if the document should be included in this query, given the query filters
      if (matchSelector(newDoc, selector)) {
        // TODO: handle order using the selector
        const newData = addToData({ queryResult, multiResolverName, document: newDoc, sort, selector });
        cache.writeQuery({ query: multiQuery, variables, data: newData });
      }
    } catch (err) {
      // could not find the query
      // TODO: be smarter about the error cases and check only for cache mismatch
      console.log(err);
    }
  });
};

export const useCreate = (options) => {
  const { mutationOptions = {} } = options;
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);

  const typeName = collection.options.typeName;
  const resolverName = `create${typeName}`;

  const query = buildCreateQuery({ typeName, fragmentName, fragment });
  const [createFunc, ...rest] = useMutation(query, {
    update: multiQueryUpdater({ typeName, fragment, fragmentName, collection, resolverName }),
    ...mutationOptions
  });

  const extendedCreateFunc = {
    [resolverName]: (args) => createFunc({ variables: { input: args.input, data: args.data } })
  };
  return [extendedCreateFunc[resolverName], ...rest];
};

export const withCreate = options => C => {
  const { collection } = extractCollectionInfo(options);
  const typeName = collection.options.typeName;
  const funcName = `create${typeName}`;
  const legacyError = () => {
    throw new Error(`newMutation function has been removed. Use ${funcName} instead.`);
  };
  const Wrapper = props => {
    const [createFunc] = useCreate(options);
    return <C
      {...props}
      {...{ [funcName]: createFunc }}
      newMutation={legacyError}
    />;
  };

  Wrapper.displayName = `withCreate${typeName}`;
  return Wrapper;
};

export default withCreate;
