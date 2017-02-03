import { GraphQLSchema } from 'meteor/nova:core';

const generateTypeDefs = () => [`

  scalar JSON
  scalar Date
  
  ${GraphQLSchema.getCollectionsSchemas()}
  ${GraphQLSchema.getAdditionalSchemas()}

  type Query {
    ${GraphQLSchema.queries.join('\n')}
  }

  type Mutation {
    ${GraphQLSchema.mutations.join('\n')}
  }
`];

export default generateTypeDefs;