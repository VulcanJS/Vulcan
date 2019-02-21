import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
import { createCollection, addGraphQLQuery } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet

/**
 * @summary Vulcan Users namespace
 * @namespace Users
 */
export const Users = createCollection({

  collection: Meteor.users,

  collectionName: 'Users',

  typeName: 'User',

  schema,

  resolvers,

  mutations,

  description: 'A user object'

});

addGraphQLQuery('currentUser: User');

export default Users;
