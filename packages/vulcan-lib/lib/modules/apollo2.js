import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import WatchedMutationLink from 'apollo-link-watched-mutation';
import { MeteorAccountsLink } from 'meteor/apollo';
import { WatchedMutations } from '../modules/updates';

const cache = new InMemoryCache();

const watchedMutationLink = new WatchedMutationLink(cache, WatchedMutations);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
});

const meteorAccountsLink = new MeteorAccountsLink();

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    watchedMutationLink, 
    errorLink, 
    meteorAccountsLink, 
    httpLink
  ]),
  cache,
});
