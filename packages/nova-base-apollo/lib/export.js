import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import { client } from './client.js';

import { createApolloServer } from './server.js';
import typeDefs from './schema';
import resolvers from './resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

createApolloServer({
  schema,
});

export { client };