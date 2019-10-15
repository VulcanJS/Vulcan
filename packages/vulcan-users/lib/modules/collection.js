import schema from './schema.js';
import { createCollection, addGraphQLQuery, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet

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

  description: 'A user object'

});

addGraphQLQuery('currentUser: User');

export default Users;
