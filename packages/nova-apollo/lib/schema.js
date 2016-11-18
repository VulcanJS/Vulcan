import Telescope from 'meteor/nova:lib';

const generateTypeDefs = () => [`
  ${Telescope.graphQL.getCollectionsSchemas()}
  ${Telescope.graphQL.getAdditionalSchemas()}

  type Query {
    ${Telescope.graphQL.queries.join('\n')}
  }

  type Mutation {
    ${Telescope.graphQL.mutations.join('\n')}
  }
`];

export default generateTypeDefs;