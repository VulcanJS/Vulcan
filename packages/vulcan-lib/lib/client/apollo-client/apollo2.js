import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import watchedMutationLink from './links/watchedMutation'
import errorLink from './links/error'
import httpLink from './links/http'
import meteorAccountsLink from './links/meteor'
import stateLink from './links/state'
import cache from './cache'


export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    stateLink,
    watchedMutationLink,
    errorLink,
    meteorAccountsLink,
    httpLink
  ]),
  cache,
});
