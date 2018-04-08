import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { getLoginToken } from 'meteor-apollo-accounts'
import { Client } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from './index';

const wsClient = new Client('ws://localhost:8080');

const networkInterface = createNetworkInterface({ uri: '/graphql' })
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    req.options.headers.authorization = getLoginToken() || null
    next()
  }
}]);

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  // Default to using Mongo _id, must use _id for queries.
  // @see https://github.com/apollostack/meteor-integration/blob/fdf414c322337a62e5a68e9c4299a631e5832649/main-client.js#L55
  dataIdFromObject(result) {
    if (result._id && result.__typename) {
      const dataId = result.__typename + result._id;
      return dataId;
    }

    return null;
  },
})

export default client
