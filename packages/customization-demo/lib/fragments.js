import { extendFragment } from 'meteor/nova:core';

extendFragment('PostsList', `
  color # new custom property!
`);

extendFragment('PostsPage', `
  color # new custom property!
`);