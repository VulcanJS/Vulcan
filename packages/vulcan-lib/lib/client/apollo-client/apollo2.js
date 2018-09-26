import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import watchedMutationLink from './links/watchedMutation';
import errorLink from './links/error';
import httpLink from './links/http';
import meteorAccountsLink from './links/meteor';
import { getStateLink } from './links/state';
import cache from './cache';
import { createApolloClient } from '../../modules/apollo';

// these links do not change once created
const staticLinks = [watchedMutationLink, errorLink, meteorAccountsLink, httpLink];

const initialClient = new ApolloClient({
  link: ApolloLink.from([getStateLink(), ...staticLinks]),
  cache
});

let apolloClient = initialClient;

// client is only available through this helper so we can update it
export const getApolloClient = () => apolloClient;

// TODO: try this
//@see https://github.com/apollographql/apollo-link-state/issues/306
export const reloadApolloClient = () => {
  // get the current cache
  const currentCache = apolloClient.cache;
  // get the stateLink
  const newApolloClient = createApolloClient({
    link: ApolloLink.from([getStateLink(), ...staticLinks]),
    cache: currentCache
  });
  // update the client
  apolloClient = newApolloClient;
  return newApolloClient;
};
