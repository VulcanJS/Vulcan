import deepmerge from 'deepmerge';

Telescope.graphQL = {
  schemas: [],
  addSchema(schema) {
    this.schemas.push(schema);
  },
  queries: [],
  addQuery(query) {
    this.queries.push(query);
  },
  mutations: [],
  addMutation(mutation) {
    this.mutations.push(mutation);
  },
  resolvers: {},
  addResolvers(resolvers) {
    this.resolvers = deepmerge(this.resolvers, resolvers);
  },
  context: {},
  addToContext(object) {
    this.context = deepmerge(this.context, object);
  },
};