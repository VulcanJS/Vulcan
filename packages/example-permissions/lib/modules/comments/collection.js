/*

The main Comments collection definition file.

*/

import { createCollection, getDefaultResolvers } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import Pics from '../pics/collection.js';
import schema from './schema.js';
import './fragments.js';

import mutations from './mutations.js';

const Comments = createCollection({

  collectionName: 'Comments',
  
  // avoid conflicts with 'comments' collection in vulcan:comments
  dbCollectionName: 'commentsInstagram',

  typeName: 'Comment',

  schema,
  
  resolvers: getDefaultResolvers('Comments'),

  mutations,

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
  - If it is, check if:
    - the user can perform the `comments.view.deleted` action
    - OR, the user is assigned as a manager for the picture the comment belongs to
  - If it isn't, show the comment

*/

Comments.checkAccess = (currentUser, comment) => {
  if (Users.isAdmin(currentUser) || Users.owns(currentUser, comment)) { // admins can always see everything, users can always see their own comments
    return true;
  } else {
    const pic = Pics.findOne(comment.picId);
    return comment.isDeleted ? Users.canDo(currentUser, `comments.view.deleted`) || currentUser._id === pic.managerId : true;
  }
}

export default Comments;
