/*

Comments collection

*/

import schema from './schema.js';
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

/**
 * @summary The global namespace for Comments.
 * @namespace Comments
 */
 export const Comments = createCollection({

   collectionName: 'Comments',

   typeName: 'Comment',

   schema,

   resolvers: getDefaultResolvers('Comments'),

   mutations: getDefaultMutations('Comments'),

});

Comments.checkAccess = (currentUser, comment) => {
  if (Users.isAdmin(currentUser) || Users.owns(currentUser, comment)) { // admins can always see everything, users can always see their own posts
    return true;
  } else if (comment.isDeleted) {
    return false;
  } else { 
    return true;
  }
}