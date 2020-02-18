import schema from './schema.js';
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet

// check if user is mutating their own user document
const isCurrentUser = ({ user, document }) => (user && document && user._id === document._id);

/**
 * @summary Vulcan Users namespace
 * @namespace Users
 */
export const Users = createCollection({

  collection: Meteor.users,

  collectionName: 'Users',

  typeName: 'User',

  schema,

  resolvers: getDefaultResolvers({ typeName: 'User' }),

  mutations: getDefaultMutations({ typeName: 'User' }),

  description: 'A user object',

  permissions: {
    canRead: ['guests'],
    canCreate: ['admins'], // non-admins have to create new users by signing up 
    canUpdate: isCurrentUser,
    canDelete: isCurrentUser
  }

});

export default Users;
