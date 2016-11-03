import Telescope from 'meteor/nova:lib';

import { makeExecutableSchema } from 'graphql-tools';

import { client } from './client.js';

import { createApolloServer } from './server.js';
import typeDefs from './schema';

// import resolvers from './resolvers';

console.log("// Telescope.graphQL.resolvers")
console.log(Telescope.graphQL.resolvers)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: Telescope.graphQL.resolvers,
});

createApolloServer({
  schema,
});

export { client };