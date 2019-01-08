import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import watchedMutationLink from './links/watchedMutation';
import httpLink from './links/http';
import meteorAccountsLink from './links/meteor';
import errorLink from './links/error';
import {createStateLink} from '../../modules/apollo-common';
import cache from './cache';

// these links do not change once created
const staticLinks = [
  watchedMutationLink,
  errorLink,
  meteorAccountsLink,
  httpLink,
];

let apolloClient;
export const createApolloClient = () => {
  const stateLink = createStateLink({cache});
  const newClient = new ApolloClient({
    link: ApolloLink.from([stateLink, ...staticLinks]),
    cache,
  });
  // register the client
  apolloClient = newClient;
  return newClient;
};

export const getApolloClient = () => {
  if (!apolloClient) {
    console.warn('Warning: accessing apollo client before it is initialized.');
  }
  return apolloClient;
};

// This is a draft of what could be a reload of the apollo client with new Links
// for the moment there seems to be no equivalent to Redux `replaceReducers` in apollo-client
//@see https://github.com/apollographql/apollo-link-state/issues/306
//export const reloadApolloClient = () => {
//  // get the current cache
//  const currentCache = apolloClient.cache;
//  // get the stateLink
//  const newApolloClient = createApolloClient({
//    link: ApolloLink.from([getStateLink(), ...staticLinks]),
//    cache: currentCache
//  });
//  // update the client
//  apolloClient = newApolloClient;
//  return newApolloClient;
//};
