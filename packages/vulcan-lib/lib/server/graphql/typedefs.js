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

# see https://docs.hasura.io/1.0/graphql/manual/queries/query-filters.html

input String_Selector {
  _eq: String
  #_gt: String
  #_gte: String
  #_ilike: String
  _in: [String!]
  _is_null: Boolean
  _like: String
  #_lt: String
  #_lte: String
  #_neq: String
  #_nilike: String
  #_nin: [String!]
  #_nlike: String
  #_nsimilar: String
  #_similar: String
}

input String_Array_Selector {
  _in: [String!]
  _contains: String
  # _contains_all: [String_Selector]
}

input Int_Selector {
  _eq: Int
  _gt: Int
  _gte: Int
  _in: [Int!]
  #_is_null: Boolean
  _lt: Int
  _lte: Int
  #_neq: Int
  #_nin: [Int!]
}

input Int_Array_Selector {
  contains: Int_Selector
  # contains_all: [Int_Selector]
}

input Float_Selector {
  _eq: Float
  _gt: Float
  _gte: Float
  _in: [Float!]
  #_is_null: Boolean
  _lt: Float
  _lte: Float
  #_neq: Float
  #_nin: [Float!]
}

input Float_Array_Selector {
  contains: Float_Selector
  # contains_all: [Float_Selector]
}

input Boolean_Selector {
  _eq: Boolean
  #_neq: Boolean
}

input Boolean_Array_Selector {
  contains: Boolean_Selector
  # contains_all: [Boolean_Selector]
}

input Date_Selector {
  _eq: Date
  _gt: Date
  _gte: Date
  _in: [Date!]
  #_is_null: Boolean
  _lt: Date
  _lte: Date
  #_neq: Date
  #_nin: [Date!]
}

input Date_Array_Selector {
  contains: Date_Selector
  # contains_all: [Date_Selector]
}

# column ordering options
enum SortOptions {
  asc
  desc
}

input OptionsInput {
  # Whether to enable caching for this query
  enableCache: Boolean
  # For single document queries, return null instead of throwing MissingDocumentError
  allowNull: Boolean
}

${GraphQLSchema.getAdditionalSchemas()}

${GraphQLSchema.getCollectionsSchemas()}

${generateQueryType(GraphQLSchema.queries)}

${generateMutationType(GraphQLSchema.mutations)}

`,
];