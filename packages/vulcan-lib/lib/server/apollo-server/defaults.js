import { getSetting } from '../../modules/settings.js';
import { formatError } from 'apollo-errors';
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
  configServer: ({ apolloServer, app }) => {}
};

export const defaultOptions = {
  formatError,
  tracing: getSetting('apolloTracing', Meteor.isDevelopment),
  cacheControl: true
};

if (Meteor.isDevelopment) {
  defaultOptions.debug = true;
}
