/**
 * Init the graphQL schema
 */

import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeSchemas } from '@graphql-tools/merge';

import { GraphQLSchema, generateTypeDefs } from '../graphql/index.js';
import { runCallbacks } from '../../modules/callbacks.js';


const initGraphQL = () => {
  runCallbacks('graphql.init.before');
  const typeDefs = generateTypeDefs(GraphQLSchema);

  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers: GraphQLSchema.resolvers,
  });
  // only call mergeSchemas if we actually have stitchedSchemas
  let mergedSchema = GraphQLSchema.stitchedSchemas.length > 0 ? mergeSchemas({ schemas: [executableSchema, ...GraphQLSchema.stitchedSchemas] }) : executableSchema;

  // execute each directive transformer successively
  for (const directiveTransformer of GraphQLSchema.directiveTransformers) {
    mergedSchema = directiveTransformer(mergedSchema);
  }

  GraphQLSchema.finalSchema = typeDefs;
  GraphQLSchema.executableSchema = mergedSchema;
  return executableSchema;
};

export default initGraphQL;
