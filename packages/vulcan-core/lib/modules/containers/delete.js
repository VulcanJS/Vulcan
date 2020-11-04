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
import { useMutation } from '@apollo/client';
import { deleteClientTemplate } from 'meteor/vulcan:core';
import { extractCollectionInfo, extractFragmentInfo } from 'meteor/vulcan:lib';
import { buildMultiQuery } from './multi';
import { getVariablesListFromCache, removeFromData } from './cacheUpdate';

export const buildDeleteQuery = ({ typeName, fragmentName, fragment }) => (
  gql`
    ${deleteClientTemplate({ typeName, fragmentName })}
    ${fragment}
  `
);

// remove value from the cached lists
const multiQueryUpdater = ({ collection, typeName, fragmentName, fragment }) => {
  const multiResolverName = collection.options.multiResolverName;
  const deleteResolverName = `delete${typeName}`;
  return (cache, { data }) => {
    // update multi queries
    const multiQuery = buildMultiQuery({ typeName, fragmentName, fragment });
    const removedDoc = data[deleteResolverName].data;
    // get all the resolvers that match
    const variablesList = getVariablesListFromCache(cache, multiResolverName);
    variablesList.forEach(variables => {
      try {
        const queryResult = cache.readQuery({ query: multiQuery, variables });
        const newData = removeFromData({ queryResult, multiResolverName, document: removedDoc });
        cache.writeQuery({ query: multiQuery, variables, data: newData });
      } catch (err) {
        // could not find the query
        // TODO: be smarter about the error cases and check only for cache mismatch
        console.log(err);
      }
    });
  };
};

export const useDelete = (options) => {
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);
  const typeName = collection.options.typeName;
  const resolverName = `delete${typeName}`;
  const { mutationOptions = {} } = options;

  const query = buildDeleteQuery({
    fragment,
    fragmentName, typeName
  });

  const [deleteFunc, ...rest] = useMutation(query, {
    // optimistic update
    update: multiQueryUpdater({ collection, typeName, fragment, fragmentName }),
    ...mutationOptions
  });

  const extendedDeleteFunc = {
    [resolverName]: (args) => {
      // support legacy syntax mistake
      // @see https://github.com/VulcanJS/Vulcan/issues/2417
      const selector = (args && args.selector) || args;
      return deleteFunc({ variables: { selector } });
    }
  }
  return [extendedDeleteFunc[resolverName], ...rest];
};

export const withDelete = options => C => {
  const { collection } = extractCollectionInfo(options);
  const typeName = collection.options.typeName;
  const funcName = `delete${typeName}`;
  const legacyError = () => {
    throw new Error(`removeMutation function has been removed. Use ${funcName} function instead.`);
  };

  const Wrapper = (props) => {
    const [deleteFunc] = useDelete(options);
    return (
      <C {...props} {...{ [funcName]: deleteFunc }} removeMutation={legacyError} />
    );
  };
  Wrapper.displayName = `withDelete${typeName}`;
  return Wrapper;
};

export default withDelete;
