import { onError } from 'apollo-link-error';

const locationsToStr = (locations=[]) => locations.map(({column, line}) => `line ${line}, col ${column}`).join(';');
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      // eslint-disable-next-line no-console
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locationsToStr(locations)}, Path: ${path}`);
    });
  if (networkError) {
    // eslint-disable-next-line no-console
    console.log(`[Network error]: ${networkError}`);
  }
});

export default errorLink;
