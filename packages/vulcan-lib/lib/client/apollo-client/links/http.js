import { HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
});
export default httpLink;
