import { print } from 'graphql-tag/printer';

// quick way to add the subscribe and unsubscribe functions to the network interface
const addGraphQLSubscriptions = (networkInterface, wsClient) => Object.assign(networkInterface, {
  subscribe: (request, handler) => wsClient.subscribe({
    query: print(request.query),
    variables: request.variables,
  }, handler),
  unsubscribe: (id) => {
    wsClient.unsubscribe(id);
  },
});

export default addGraphQLSubscriptions;
