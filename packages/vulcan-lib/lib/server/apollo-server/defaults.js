// defaults
const graphiqlConfig = {
  graphiql: Meteor.isDevelopment,
  graphiqlPath: '/graphiql',
  graphiqlOptions: {
    passHeader: "'Authorization': localStorage['Meteor.loginToken']" // eslint-disable-line quotes
  }
};
export const defaultConfig = {
  path: '/graphql',
  ...graphiqlConfig,
  maxAccountsCacheSizeInMB: 1,
  configServer: graphQLServer => {}
};

export const defaultOptions = {
  formatError: e => ({
    message: e.message,
    locations: e.locations,
    path: e.path
  })
};

if (Meteor.isDevelopment) {
  defaultOptions.debug = true;
}
