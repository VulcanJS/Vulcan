import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
import { createCollection } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

/**
 * @summary The global namespace for Comments.
 * @namespace Comments
 */
 const Comments = createCollection({

   collectionName: 'Comments',

   typeName: 'Comment',

   schema,

   resolvers,

   mutations,

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

export default Comments;
