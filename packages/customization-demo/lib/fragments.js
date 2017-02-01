import { registerFragment, getFragment } from 'meteor/nova:lib';
import gql from 'graphql-tag';

const CustomPostsListFragment = gql`
  fragment CustomPostsList on Post {
    ...PostsList
    color # new custom property!
  }
  ${getFragment('PostsList')}
`;

registerFragment(CustomPostsListFragment, 'PostsList');
registerFragment(CustomPostsListFragment, 'PostsPage');
