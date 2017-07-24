/*

The main Comments collection definition file.

*/

import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';
import './fragments.js';

const Comments = createCollection({

  collectionName: 'Comments',
  
  // avoid conflicts with 'comments' collection in vulcan:comments
  dbCollectionName: 'commentsInstagram',

  typeName: 'Comment',

  schema,
  
  resolvers: getDefaultResolvers('Comments'),

  mutations: getDefaultMutations('Comments'),

});

/*

Set a default results view whenever the Comments collection is queried:

- Comments are limited to those corresponding to the current picture
- They're sorted by their createdAt timestamp in ascending order

*/

Comments.addDefaultView(terms => {
  return {
    selector: {picId: terms.picId},
    options: {sort: {createdAt: 1}}
  };
});

/*

Define view permissions. 

- Admin or comment owners can always view any document
- For anybody else, check if the comment is deleted
  - If it is, check if the user can perform the `comments.view.deleted` action
  - If it isn't, show the comment

*/

Comments.checkAccess = (currentUser, comment) => {
  if (Users.isAdmin(currentUser) || Users.owns(currentUser, comment)) { // admins can always see everything, users can always see their own comments
    return true;
  } else { 
    return comment.isDeleted ? Users.canDo(currentUser, `comments.view.deleted`) : true;
  }
}

export default Comments;
