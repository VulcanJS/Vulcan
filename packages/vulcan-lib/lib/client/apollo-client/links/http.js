import { HttpLink } from 'apollo-link-http';

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
});
export default httpLink;
