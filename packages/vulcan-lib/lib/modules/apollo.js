import ApolloClient, { createNetworkInterface, createBatchingNetworkInterface } from 'apollo-client';
import 'isomorphic-fetch';

import { Meteor } from 'meteor/meteor';

import { getSetting } from './settings.js';

const defaultNetworkInterfaceConfig = {
  path: '/graphql', // default graphql server endpoint
  opts: {}, // additional fetch options like `credentials` or `headers`
  useMeteorAccounts: true, // if true, send an eventual Meteor login token to identify the current user with every request
  batchingInterface: true, // use a BatchingNetworkInterface by default instead of a NetworkInterface
  batchInterval: 10, // default batch interval
};

const createMeteorNetworkInterface = (givenConfig = {}) => {
  const config = { ...defaultNetworkInterfaceConfig, ...givenConfig };

  // absoluteUrl adds a '/', so let's remove it first
  let path = config.path;
  if (path[0] === '/') {
    path = path.slice(1);
  }

  const uri = Meteor.absoluteUrl(
    path,
    { rootUrl: getSetting('developmentServerIp', Meteor.absoluteUrl()) },
  );

  // allow the use of a batching network interface; if the options.batchingInterface is not specified, fallback to the standard network interface
  const interfaceToUse = config.batchingInterface ? createBatchingNetworkInterface : createNetworkInterface;

  // default interface options
  const interfaceOptions = {
    uri,
    opts: {
      credentials: 'same-origin', // http://dev.apollodata.com/react/auth.html#Cookie
    },
  };

  // if a BatchingNetworkInterface is used with a correct batch interval, add it to the options
  if (config.batchingInterface && config.batchInterval) {
    interfaceOptions.batchInterval = config.batchInterval;
  }

  // if 'fetch' has been configured to be called with specific opts, add it to the options
  if (Object.keys(config.opts).length > 0) {
    interfaceOptions.opts = config.opts;
  }

  const networkInterface = interfaceToUse(interfaceOptions);

  if (config.useMeteorAccounts) {
    networkInterface.use([{
      applyBatchMiddleware(request, next) {
        const currentUserToken = Meteor.isClient ? global.localStorage['Meteor.loginToken'] : config.loginToken;

        if (!currentUserToken) {
          next();
          return;
        }

        if (!request.options.headers) {
          request.options.headers = new Headers();
        }

        request.options.headers.Authorization = currentUserToken;

        next();
      },
    }]);
  }

  return networkInterface;
};

const meteorClientConfig = networkInterfaceConfig => ({
  ssrMode: Meteor.isServer,
  networkInterface: createMeteorNetworkInterface(networkInterfaceConfig),
  queryDeduplication: true, // http://dev.apollodata.com/core/network.html#query-deduplication
  addTypename: true,
 
  // Default to using Mongo _id, must use _id for queries.
  dataIdFromObject(result) {
    if (result._id && result.__typename) {
      const dataId = result.__typename + result._id;
      return dataId;
    }
    return null;
  },
});

export const createApolloClient = options => new ApolloClient(meteorClientConfig(options));
