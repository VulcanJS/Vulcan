import {getSetting} from '../../modules/settings.js';
import {formatError} from 'apollo-errors';
// defaults

export const defaultConfig = {
  path: '/graphql',
  maxAccountsCacheSizeInMB: 1,
  configServer: apolloServer => {},
  voyagerPath: '/graphql-voyager',
  graphiqlPath: '/graphiql'
};

export const defaultOptions = {
  formatError,
  tracing: getSetting('apolloTracing', Meteor.isDevelopment),
  cacheControl: true,
};

if (Meteor.isDevelopment) {
  defaultOptions.debug = true;
}
