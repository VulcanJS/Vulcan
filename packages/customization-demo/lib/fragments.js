import { extendFragment } from 'meteor/nova:lib';

extendFragment('PostsList', `
  color # new custom property!
`);

extendFragment('PostsPage', `
  color # new custom property!
`);