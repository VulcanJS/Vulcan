import ApolloClient, { createNetworkInterface } from 'apollo-client';
import 'isomorphic-fetch';

const defaultNetworkInterfaceConfig = {
  path: '/graphql',
  options: {},
};

const createMeteorNetworkInterface = (givenConfig = {}) => {
  const config = _.extend(defaultNetworkInterfaceConfig, givenConfig);

  // absoluteUrl adds a '/', so let's remove it first
  let path = config.path;
  if (path[0] === '/') {
    path = path.slice(1);
  }

  // add the rootUrl option, in case tests are made on development server
  // see https://github.com/TelescopeJS/Telescope/issues/1554#issuecomment-277445915
  const uri = Meteor.absoluteUrl(
    path, 
    { rootUrl: getSetting('developmentServerIp', Meteor.absoluteUrl()) }
  );
  const networkInterface = createNetworkInterface({
    uri,
    opts: {
      credentials: 'same-origin',
    }
  });

  networkInterface.use([{
    applyMiddleware(request, next) {
      const currentUserToken = Meteor.isClient ? global.localStorage['Meteor.loginToken'] : config.currentUserToken;

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

  return networkInterface;
};

const meteorClientConfig = networkInterfaceConfig => ({
  ssrMode: Meteor.isServer,
  networkInterface: createMeteorNetworkInterface(networkInterfaceConfig),
  queryDeduplication: true,

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
