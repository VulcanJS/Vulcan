/*

Run a GraphQL query from the server with the proper context

*/
import { graphql } from 'graphql';
import { executableSchema } from './apollo_server.js';
import { Collections } from '../modules/collections.js';
import DataLoader from 'dataloader';
import findByIds from '../modules/findbyids.js';

export const runQuery = async (query, variables = {}) => {
  
  const context = {};

  // within the scope of this specific query, 
  // decorate each collection with a new Dataloader object and add it to context
  Collections.forEach(collection => {
    collection.loader = new DataLoader(ids => findByIds(collection, ids, context), { cache: true });
    context[collection.options.collectionName] = collection;
  });

  // see http://graphql.org/graphql-js/graphql/#graphql
  const result = await graphql(executableSchema, query, {}, context, variables);

  if (result.errors) {
    console.log('runQuery error: '+result.errors[0].message);
    throw new Error(result.errors[0].message); // doesn't work??
  }

  return result;
}