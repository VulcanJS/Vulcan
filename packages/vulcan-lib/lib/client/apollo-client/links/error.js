import { onError } from 'apollo-link-error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      // eslint-disable-next-line no-console
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  if (networkError) {
    // eslint-disable-next-line no-console
    console.log(`[Network error]: ${networkError}`);
  }
});

export default errorLink;
