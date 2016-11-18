import Telescope from 'meteor/nova:lib';

import { makeExecutableSchema } from 'graphql-tools';

import { meteorClientConfig, client } from './client.js';

import { createApolloServer } from './server.js';
import generateTypeDefs from './schema';

Meteor.startup(function () {
  
  const typeDefs = generateTypeDefs();

  Telescope.graphQL.finalSchema = typeDefs;

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: Telescope.graphQL.resolvers,
  });

  createApolloServer({
    schema,
  });
});

export { meteorClientConfig, client };