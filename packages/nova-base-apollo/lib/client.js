// note(oct. 28, 2016)
// by-pass the meteor integration to use the features of apollo-client 0.5.x / graphql-server 0.4.x

// -------
// start of main-client from apollostack/meteor-integration

import ApolloClient, { createBatchingNetworkInterface } from 'apollo-client';
import { addTypenameToSelectionSet } from 'apollo-client/queries/queryTransform';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';

const defaultNetworkInterfaceConfig = {
  path: '/graphql',
  options: {},
  useMeteorAccounts: true
};

export const createMeteorNetworkInterface = (givenConfig) => {
  const config = _.extend(defaultNetworkInterfaceConfig, givenConfig);

  // absoluteUrl adds a '/', so let's remove it first
  let path = config.path;
  if (path[0] === '/') {
    path = path.slice(1);
  }

  // For SSR
  const url = Meteor.absoluteUrl(path);
  const networkInterface = createBatchingNetworkInterface({
    uri: url,
    batchInterval: 10
  });

  if (config.useMeteorAccounts) {
    networkInterface.use([{
      applyMiddleware(request, next) {
        const currentUserToken = Accounts._storedLoginToken();

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

export const meteorClientConfig = (networkInterfaceConfig) => {
  return {
    ssrMode: true,
    networkInterface: createMeteorNetworkInterface(networkInterfaceConfig),
    queryTransformer: addTypenameToSelectionSet,

    // Default to using Mongo _id, must use _id for queries.
    dataIdFromObject: (result) => {
      if (result._id && result.__typename) {
        const dataId = result.__typename + result._id;
        return dataId;
      }
    },
  };
};

// end of main-client from apollostack/meteor-integration
// --------

export const client = new ApolloClient(meteorClientConfig());