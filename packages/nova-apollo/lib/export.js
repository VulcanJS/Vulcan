import { GraphQLSchema } from 'meteor/nova:lib';

import { makeExecutableSchema } from 'graphql-tools';

import { meteorClientConfig } from './client.js';

import { createApolloServer } from './server.js';
import generateTypeDefs from './schema';

Meteor.startup(function () {
  const typeDefs = generateTypeDefs();

  GraphQLSchema.finalSchema = typeDefs;

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: GraphQLSchema.resolvers,
  });
  
  // uncomment for debug
  // console.log('// --> starting graphql server');
  
  createApolloServer({
    schema,
  });
});

export { meteorClientConfig };
