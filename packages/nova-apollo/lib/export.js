import { GraphQLSchema } from 'meteor/nova:lib';

import { makeExecutableSchema } from 'graphql-tools';

import { meteorClientConfig } from './client.js';

import { createApolloServer } from './server.js';
import generateTypeDefs from './schema';

import OpticsAgent from 'optics-agent'

Meteor.startup(function () {
  const typeDefs = generateTypeDefs();

  GraphQLSchema.finalSchema = typeDefs;

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: GraphQLSchema.resolvers,
  });
  
  if (process.env.OPTICS_API_KEY) {
    OpticsAgent.instrumentSchema(schema)
  }

  // uncomment for debug
  // console.log('// --> starting graphql server');
  
  createApolloServer({
    schema,
  });
});

export { meteorClientConfig };
