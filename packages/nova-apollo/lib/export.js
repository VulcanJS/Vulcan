import Telescope from 'meteor/nova:lib';

import { makeExecutableSchema } from 'graphql-tools';

import { client } from './client.js';

import { createApolloServer } from './server.js';
import typeDefs from './schema';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: Telescope.graphQL.resolvers,
});

createApolloServer({
  schema,
});

export { client };