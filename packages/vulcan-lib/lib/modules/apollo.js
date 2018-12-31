import ApolloClient, { createNetworkInterface, createBatchingNetworkInterface } from 'apollo-client';
import 'cross-fetch/polyfill';
import { Meteor } from 'meteor/meteor';
import { getSetting, registerSetting } from './settings.js';
import { getFragmentMatcher } from './fragment_matcher.js';
import { runCallbacks } from './callbacks.js';

registerSetting('graphQLendpointURL', '/graphql', 'GraphQL endpoint URL');

const defaultNetworkInterfaceConfig = {
  path: '/graphql', // default graphql server endpoint
  opts: { foo: 'bar' }, // additional fetch options like `credentials` or `headers`; note: for some reason when this is empty additional options can't be added
  useMeteorAccounts: true, // if true, send an eventual Meteor login token to identify the current user with every request
  batchingInterface: true, // use a BatchingNetworkInterface by default instead of a NetworkInterface
  batchInterval: 10, // default batch interval
};

const createMeteorNetworkInterface = (givenConfig = {}) => {
  const config = { ...defaultNetworkInterfaceConfig, ...givenConfig };

  // console.log('// apollo.js createMeteorNetworkInterface config.headers');
  // console.log(config.headers); // note: only defined on server
  // console.log('\n\n');

  // absoluteUrl adds a '/', so let's remove it first
  let path = config.path;
  if (path[0] === '/') {
    path = path.slice(1);
  }

  const defaultUri = Meteor.absoluteUrl(path);
  const uri = getSetting('graphQLendpointURL', defaultUri);

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

        if (Meteor.isServer) {
          // handle server use case separetly or else everything breaks
          if (!request.options.headers) {
            request.options.headers = new Headers();
          }
          request.options.headers = config.headers;
          // if we're on the server and this request has been originated by a client 
          // (and not SSR) save the original headers
          if (config.headers && !config.headers.originalHeaders) {
            request.options.headers.originalHeaders = JSON.stringify(config.headers);
          }
          if (!currentUserToken) {
            next();
            return;
          }
          request.options.headers.Authorization = currentUserToken;
          next();
        } else {
          // handle client use case separetly or else everything breaks
          if (!currentUserToken) {
            next();
            return;
          }
          if (!request.options.headers) {
            request.options.headers = new Headers();
          }
          request.options.headers.Authorization = currentUserToken;
          next();
        }
        
      },
    }]);
  }

  return networkInterface;
};

const meteorClientConfig = networkInterfaceConfig => {

  return {
    ssrMode: Meteor.isServer,
    networkInterface: createMeteorNetworkInterface(networkInterfaceConfig),
    queryDeduplication: true, // http://dev.apollodata.com/core/network.html#query-deduplication
    addTypename: true,
    fragmentMatcher: getFragmentMatcher(),

    // Default to using Mongo _id, must use _id for queries.
    dataIdFromObject(result) {
      if (result._id && result.__typename) {
        const dataId = result.__typename + result._id;
        return dataId;
      }
      return null;
    },
  };
};

export const createApolloClient = options => {

  runCallbacks('apolloclient.init.before');

  return new ApolloClient(meteorClientConfig(options));

};
