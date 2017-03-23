import { extendFragment } from 'meteor/vulcan:core';

extendFragment('PostsList', `
  color # new custom property!
`);

extendFragment('PostsPage', `
  color # new custom property!
`);