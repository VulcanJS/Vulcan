import { Mongo } from 'meteor/mongo';
import { graphql } from 'graphql';
import { GraphQLSchema } from './graphql/index.js';
import NodeCache from 'node-cache';

export const nodeCache = new NodeCache();

export const CachedResults = new Mongo.Collection('cached_results');

/*

Cache a server-side query based on the query text and variables.

MongoDB version (not currently used internally)

*/
export const useMongoQueryCache = async ({ key, query, variables, context }) => {
  const executableSchema = GraphQLSchema.getExecutableSchema();
  const cachedItem = (await key) ? CachedResults.findOne({ key }) : CachedResults.findOne({ query, variables });
  if (cachedItem) {
    return cachedItem.result;
  } else {
    const result = await graphql(executableSchema, query, {}, context, variables);
    await CachedResults.insert({ createdAt: new Date(), query, variables, result, key });
    return result;
  }
};

export const invalidateMongoCache = async () => {
  CachedResults.remove({});
};

/*

In-memory version

*/
export const useQueryCache = async ({ key, query, variables, context }) => {
  const executableSchema = GraphQLSchema.getExecutableSchema();
  const cachedItem = nodeCache.get(key);
  if (cachedItem) {
    return cachedItem.result;
  } else {
    const result = await graphql(executableSchema, query, {}, context, variables);
    nodeCache.set(key, { createdAt: new Date(), query, variables, result });
    return result;
  }
};

export const invalidateCache = () => {
  nodeCache.flushAll();
};
