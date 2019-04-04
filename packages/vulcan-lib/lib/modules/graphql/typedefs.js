/**
 * Generate GraphQL typedefs
 */


// schema generation
const generateQueryType = (queries = []) => 
  queries.length === 0
  ? ''
  : `type Query {
${queries
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

const generateMutationType = (mutations = []) => 
  mutations.length === 0
  ? ''
  : `type Mutation {
${mutations
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
`;

// typeDefs
export const generateTypeDefs = (GraphQLSchema) => [
  `
scalar JSON
scalar Date

${GraphQLSchema.getAdditionalSchemas()}

${GraphQLSchema.getCollectionsSchemas()}

${generateQueryType(GraphQLSchema.queries)}

${generateMutationType(GraphQLSchema.mutations)}

`,
];