import { onError } from '@apollo/client/link/error';

const locationsToStr = (locations=[]) => locations.map(({column, line}) => `line ${line}, col ${column}`).join(';');
const errorLink = onError(error => {
  const { graphQLErrors, networkError } = error;
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      // eslint-disable-next-line no-console
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locationsToStr(locations)}, Path: ${path}`);
    });
  if (networkError) {
    // eslint-disable-next-line no-console
    console.log(`[${networkError.statusCode} ${networkError.response?.statusText}]: ${networkError.message}`);
  }
});

export default errorLink;
