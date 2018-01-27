import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
// import ApolloClient, { createNetworkInterface, createBatchingNetworkInterface } from 'apollo-client';
import 'cross-fetch/polyfill';
import { Meteor } from 'meteor/meteor';
import { getSetting, registerSetting } from './settings.js';
import { getFragmentMatcher } from './fragment_matcher.js';
import { Callbacks, runCallbacks } from './callbacks.js';

registerSetting('developmentServerIp', Meteor.absoluteUrl(), 'Development server IP');

const defaultNetworkInterfaceConfig = {
  path: '/graphql', // default graphql server endpoint
  opts: {}, // additional fetch options like `credentials` or `headers`
  useMeteorAccounts: true, // if true, send an eventual Meteor login token to identify the current user with every request
  batchingInterface: true, // use a BatchingNetworkInterface by default instead of a NetworkInterface
  batchInterval: 10, // default batch interval
};

const createMeteorNetworkInterface = (givenConfig = {}) => {
  const config = {
    ...defaultNetworkInterfaceConfig,
    ...givenConfig,
  };

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
  // const interfaceToUse = config.batchingInterface ? createBatchingNetworkInterface : createNetworkInterface;

  // default interface options
  const interfaceOptions = {
    uri,
    credentials: 'same-origin', // http://dev.apollodata.com/react/auth.html#Cookie
  };

  // if a BatchingNetworkInterface is used with a correct batch interval, add it to the options
  if (config.batchingInterface && config.batchInterval) {
    interfaceOptions.batchInterval = config.batchInterval;
  }

  // if 'fetch' has been configured to be called with specific opts, add it to the options
  if (Object.keys(config.opts).length > 0) {
    interfaceOptions.opts = config.opts;
  }

  const httpLink = createHttpLink(interfaceOptions);
  // const networkInterface = interfaceToUse(interfaceOptions);
  let middlewareLink = [];
  if (config.useMeteorAccounts) {
    middlewareLink = setContext((context) => {
      console.log('context => ', context);
      const currentUserToken = Meteor.isClient ? global.localStorage['Meteor.loginToken'] : config.loginToken;
      return {
        headers: { 
          authorization: currentUserToken, // this should become the norm.
          Authorization: currentUserToken, // purch this
        }
      }
    });

    // networkInterface.use([{
    //   applyBatchMiddleware(request, next) {
    //     const currentUserToken = Meteor.isClient ? global.localStorage['Meteor.loginToken'] : config.loginToken;

    //     if (!currentUserToken) {
    //       next();
    //       return;
    //     }

    //     if (!request.options.headers) {
    //       request.options.headers = new Headers();
    //     }

    //     request.options.headers.Authorization = currentUserToken;

    //     next();
    //   },
    // }]);
  }

  const errorLink = onError(({ networkError, graphQLErrors }) => {
    // TODO: What are the reasons to use errorLink?
    if (networkError.statusCode === 401) {
      // new Meteor.Error();
    }
  });

  const logger = new ApolloLink((operation, forward) => {
    console.log(operation.operationName);
    return forward(operation).map((result) => {
      console.log(`received result from ${operation.operationName}`);
      return result;
    })
  });

  return logger.concat(
    errorLink.concat(
      middlewareLink.concat(
        httpLink
      )
    )
  );
};

const dataIdFromObject = result => {
  console.log('dataIdFromObject => ', result);
  if (result._id && result.__typename) {
    const dataId = result.__typename + result._id;
    return dataId;
  }
  return null;
};

const cache = new InMemoryCache({
  dataIdFromObject,// custom idGetter,
  addTypename: true,
  cacheResolvers: {},
  fragmentMatcher: getFragmentMatcher(),
});

const meteorClientConfig = networkInterfaceConfig => {

  return {
    link: createMeteorNetworkInterface(networkInterfaceConfig),
    // use restore on the cache instead of initialState
    cache: cache.restore(typeof window !== 'undefined' && window.__APOLLO_CLIENT__),
    ssrMode: Meteor.isServer,
    // networkInterface: createMeteorNetworkInterface(networkInterfaceConfig),
    queryDeduplication: true, // http://dev.apollodata.com/core/network.html#query-deduplication
    ssrForceFetchDelay: 100,
    connectToDevTools: true,
    // addTypename: true,
    // fragmentMatcher: getFragmentMatcher(),

    // Default to using Mongo _id, must use _id for queries.
    // dataIdFromObject(result) {
    //   console.log(result);
    //   if (result._id && result.__typename) {
    //     const dataId = result.__typename + result._id;
    //     return dataId;
    //   }
    //   return null;
    // },
  }
};

export const createApolloClient = options => {
  runCallbacks('apolloclient.init.before');

  return new ApolloClient(meteorClientConfig(options));
};