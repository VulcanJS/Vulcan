import { registerFragment, getFragment } from 'meteor/nova:lib';

const CustomPostsListFragment = `
  fragment CustomPostsList on Post {
    ...PostsList
    color # new custom property!
  }
`;

registerFragment(CustomPostsListFragment, 'PostsList');
registerFragment(CustomPostsListFragment, 'PostsPage');
