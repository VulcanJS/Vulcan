import Telescope from 'meteor/nova:lib';
import Users from './collection.js';

Telescope.graphQL.addQuery(`
  users: [User]
  user(_id: String, slug: String): User
  currentUser: User
`);