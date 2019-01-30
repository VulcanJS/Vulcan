/**
 * Init the graphQL schema
 */

import { makeExecutableSchema } from 'apollo-server';
import { GraphQLSchema } from '../../modules/graphql.js';
import { runCallbacks } from '../../modules/callbacks.js';

const getQueries = () =>
  `type Query {
${GraphQLSchema.queries
    .map(
      q =>
        `${
          q.description
            ? `  # ${q.description}
`
            : ''
        }  ${q.query}
  `
    )
    .join('\n')}
}

`;
const getMutations = () =>
  GraphQLSchema.mutations.length > 0
    ? `
${
        GraphQLSchema.mutations.length > 0
          ? `type Mutation {

${GraphQLSchema.mutations
              .map(
                m =>
                  `${
                    m.description
                      ? `  # ${m.description}
`
                      : ''
                  }  ${m.mutation}
`
              )
              .join('\n')}
}
`
          : ''
      }

`
    : '';
// typeDefs
const generateTypeDefs = () => [
  `
scalar JSON
scalar Date

${GraphQLSchema.getAdditionalSchemas()}

${GraphQLSchema.getCollectionsSchemas()}

${getQueries()}

${getMutations()}

`,
];

const initGraphQL = () => {
  runCallbacks('graphql.init.before');
  const typeDefs = generateTypeDefs();
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers: GraphQLSchema.resolvers,
    schemaDirectives: GraphQLSchema.directives,
  });
  GraphQLSchema.finalSchema = typeDefs;
  GraphQLSchema.executableSchema = executableSchema;
  return executableSchema;
};

export default initGraphQL;
