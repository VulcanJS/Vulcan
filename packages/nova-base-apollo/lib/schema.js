import Telescope from 'meteor/nova:lib';

export default schema = [`
${Telescope.graphQL.schemas.join('\n')}

type Query {
  ${Telescope.graphQL.queries.join('\n')}
}

type Mutation {
  ${Telescope.graphQL.mutations.join('\n')}
}
`];
