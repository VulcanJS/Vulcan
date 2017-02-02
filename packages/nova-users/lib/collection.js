import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
import { createCollection, GraphQLSchema } from 'meteor/nova:lib'; // import from nova:lib because nova:core isn't loaded yet

/**
 * @summary Telescope Users namespace
 * @namespace Users
 */
const Users = createCollection({

  collection: Meteor.users,

  collectionName: 'users',

  typeName: 'User',

  schema,

  resolvers,

  mutations,

});

GraphQLSchema.addQuery(`currentUser: User`);

export default Users;
