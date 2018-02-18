import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import 'cross-fetch/polyfill';
import { Meteor } from 'meteor/meteor';
import { getSetting, registerSetting } from './settings.js';
import { getFragmentMatcher } from './fragment_matcher.js';
import { runCallbacks } from './callbacks.js';

registerSetting('graphQLendpointURL', '/graphql', 'GraphQL endpoint URL');

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

  const defaultUri = Meteor.absoluteUrl(path);
  const uri = getSetting('graphQLendpointURL', defaultUri);

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
      // Example context
      // context =>  {
      //   variables:
      //   { terms: { limit: 5, itemsPerPage: 5 },
      //     enableCache: false,
      //     currentUser: null
      //   },
      //   extensions: {},
      //   operationName: 'MoviesListQuery',
      //   query: {
      //     kind: 'Document',
      //     definitions: [ [Object], [Object] ],
      //     loc: { start: 0, end: 375, source: [Object] } } }
      const currentUserToken = Meteor.isClient ? global.localStorage['Meteor.loginToken'] : config.loginToken;
      return {
        headers: {
          authorization: currentUserToken, // this should become the norm.
          Authorization: currentUserToken, // purch this
        }
      };
    });
  }

  const errorLink = onError(({ networkError, graphQLErrors }) => {
    // TODO: This will help to throw better
    if (networkError.statusCode === 401) {
      console.log('Do something on 401, also become a better Error then your predecessor!');
      // new Meteor.Error();
    }
  });

  const logger = new ApolloLink((operation, forward) => {
    // console.log('logger => ', operation.operationName);
    return forward(operation).map((result) => {
      // console.log(`logger => received result from ${operation.operationName}`);
      return result;
    });
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
  // console.log('dataIdFromObject => ', result);
  if (result._id && result.__typename) {
    const dataId = result.__typename + result._id;
    return dataId;
  }
  return null;
};

const cache = new InMemoryCache({
  dataIdFromObject,// custom idGetter,
  addTypename: true,
  cacheRedirects: {},
  // cacheResolvers: {},
  fragmentMatcher: getFragmentMatcher(),
});

const meteorClientConfig = networkInterfaceConfig => {
  // This is still a work in progress
  return {
    link: createMeteorNetworkInterface(networkInterfaceConfig),
    // use restore on the cache instead of initialState
    cache: cache.restore(typeof window !== 'undefined' && window.__APOLLO_CLIENT__),
    ssrMode: Meteor.isServer,
    queryDeduplication: true, // http://dev.apollodata.com/core/network.html#query-deduplication
    ssrForceFetchDelay: 100,
    connectToDevTools: true,
  }
};

export const createApolloClient = options => {
  runCallbacks('apolloclient.init.before');

  return new ApolloClient(meteorClientConfig(options));
};

// Apollo boost example

// const client = new ApolloClient({
//   uri: 'https://nx9zvp49q7.lp.gql.zone/graphql',
//   fetchOptions: {
//     credentials: 'include'
//   },
//   request: async (operation) => {
//     const token = await AsyncStorage.getItem('token');
//     operation.setContext({
//       headers: {
//         authorization: token
//       }
//     });
//   },
//   onError: ({ graphQLErrors, networkError }) => {
//     if (graphQLErrors) {
//       sendToLoggingService(graphQLErrors);
//     }
//     if (networkError) {
//       logoutUser();
//     }
//   },
//   clientState: {
//     defaults: {
//       isConnected: true
//     },
//     resolvers: {
//       Mutation: {
//         updateNetworkStatus: (_, { isConnected }, { cache }) => {
//           cache.writeData({ data: { isConnected }});
//           return null;
//         }
//       }
//     }
//   },
//   cacheRedirects: {
//     Query: {
//       movie: (_, { id }, { getCacheKey }) =>
//         getCacheKey({ __typename: 'Movie', id });
// }
// }
// });
