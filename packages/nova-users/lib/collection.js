import Telescope from 'meteor/nova:lib';
import schema from './schema.js';
import fragments from './fragments.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';

/**
 * @summary Telescope Users namespace
 * @namespace Users
 */
const Users = Telescope.createCollection({

  collection: Meteor.users,

  collectionName: 'users',

  typeName: 'User',

  schema,

  fragments,

  resolvers,

  mutations,

});

Telescope.graphQL.addQuery(`currentUser: User`);

export default Users;