/**
 * Init the graphQL schema
 */

import { makeExecutableSchema } from 'apollo-server';
import { mergeSchemas } from 'graphql-tools';
import { GraphQLSchema, generateTypeDefs } from '../../modules/graphql';
import { runCallbacks } from '../../modules/callbacks.js';


const initGraphQL = () => {
  runCallbacks('graphql.init.before');
  const typeDefs = generateTypeDefs(GraphQLSchema);
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers: GraphQLSchema.resolvers,
    schemaDirectives: GraphQLSchema.directives,
  });
  // only call mergeSchemas if we actually have stitchedSchemas
  const mergedSchema = GraphQLSchema.stitchedSchemas.length > 0 ? mergeSchemas({ schemas: [executableSchema, ...GraphQLSchema.stitchedSchemas] }) : executableSchema;

  GraphQLSchema.finalSchema = typeDefs;
  GraphQLSchema.executableSchema = mergedSchema;
  return executableSchema;
};

export default initGraphQL;
