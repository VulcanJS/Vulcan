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
import { extractCollectionInfo, extractFragmentInfo } from 'meteor/vulcan:lib';
import { useMutation } from '@apollo/react-hooks';
import { buildMultiQuery } from './multi';
import { addToData, getVariablesListFromCache } from './cacheUpdate';

const buildCreateQuery = ({ typeName, fragmentName, fragment }) => {
  const query = gql`
    ${createClientTemplate({ typeName, fragmentName })}
    ${fragment}
  `;
  return query;
};

export const useCreate = (options) => {
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);

  const typeName = collection.options.typeName;
  const createResolverName = `create${typeName}`;
  const multiResolverName = collection.options.multiResolverName;

  const query = buildCreateQuery({ typeName, fragmentName, fragment });
  const [createFunc] = useMutation(query, {

    update: (cache, { data }) => {
      /*
      PREVIOUS IMPLEMENTION with watched mutations
      Some code should serve as inspiration
      
        if (mutations.create) {
        const mutationName = mutations.create.name;
        registerWatchedMutation(mutationName, multiQueryName, ({ mutation, query }) => {
          // get mongo selector and options objects based on current terms
          const terms = query.variables.input.terms;
          const collection = Collections.find(c => c.typeName === typeName);
          const parameters = collection.getParameters(terms);
          const { selector, options } = parameters;
          let results = query.result;
          const document = getDocumentFromMutation(mutation, mutationName);
          // nothing to add
          if (!document) return results;
  
          if (belongsToSet(document, selector)) {
            if (!isInSet(results[multiResolverName], document)) {
              // make sure document hasn't been already added as this may be called several times
              results[multiResolverName] = addToSet(results[multiResolverName], document);
            }
            results[multiResolverName] = reorderSet(results[multiResolverName], options.sort);
          }
  
          results[multiResolverName].__typename = `Multi${typeName}Output`;
  
          // console.log('// create');
          // console.log(mutation);
          // console.log(query);
          // console.log(collection);
          // console.log(parameters);
          // console.log(results);
  
          return results;
        });
      }
      */
      // update multi queries
      const multiQuery = buildMultiQuery({ typeName, fragmentName, fragment });
      const newDoc = data[createResolverName].data;
      // get all the resolvers that match
      const variablesList = getVariablesListFromCache(cache, multiResolverName);
      variablesList.forEach(variables => {
        try {
          // TODO: check if the document is appliable to this query, depending on the selector
          const queryResult = cache.readQuery({ query: multiQuery, variables });
          // TODO: handle order using the selector
          const newData = addToData({ queryResult, multiResolverName, document: newDoc });
          cache.writeQuery({ query: multiQuery, variables, data: newData });
        } catch (err) {
          // could not find the query
          // TODO: be smarter about the error cases and check only for cache mismatch
          console.log(err);
        }
      });
    }
  });
  // so the syntax is useCreate({collection: ...}, {data: ...})
  const extendedCreateFunc = (args) => createFunc({ variables: { data: args.data } });
  return [extendedCreateFunc];
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
