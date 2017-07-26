/*

Default mutations

*/

import { newMutation, editMutation, removeMutation, Utils } from 'meteor/vulcan:lib';
import Users from 'meteor/vulcan:users';
import Pics from '../pics/collection.js';

/*

Define edit/remove permissions. 

- If the user or the comment are not defined, return false
- If the user owns the comment, check if they can perform `comments.edit.own`
- Else, check if user can perform `comments.edit.all`
  - If yes, return true
  - If not, check if the user is the manager for the pic the comments belongs to

*/

const check = (user, document, pic = Pics.findOne(document.picId)) => {
  if (!user || !document) return false;

  if (Users.owns(user, document)) {
    return Users.canDo(user, `comments.edit.own`);
  } else {
    if (Users.canDo(user, `comments.edit.all`)) {
      return true;
    } else {
      return pic.managerId === user._id
    }
  }
}

const mutations = {

  // mutation for inserting a new document

  new: {
    
    name: 'commentsNew',
    
    // check function called on a user to see if they can perform the operation
    check(user) {
      // if user is not logged in, disallow operation
      if (!user) return false;
      // else, check if they can perform "foo.new" operation (e.g. "movies.new")
      return Users.canDo(user, 'comments.new');
    },
    
    mutation(root, {document}, context) {
      
      const collection = context.Comments;

      // check if current user can pass check function; else throw error
      Utils.performCheck(this.check, context.currentUser, document);

      // pass document to boilerplate newMutation function
      return newMutation({
        collection,
        document: document, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  // mutation for editing a specific document

  edit: {
    
    name: 'commentsEdit',
    
    // check function called on a user and document to see if they can perform the operation
    check,

    mutation(root, {documentId, set, unset}, context) {

      const collection = context.Comments;

      // get entire unmodified document from database
      const document = collection.findOne(documentId);

      // check if user can perform operation; if not throw error
      Utils.performCheck(this.check, context.currentUser, document);

      // call editMutation boilerplate function
      return editMutation({
        collection, 
        documentId: documentId, 
        set: set, 
        unset: unset, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },
  
  // mutation for removing a specific document (same checks as edit mutation)

  remove: {

    name: 'commentsRemove',
    
    check,
    
    mutation(root, {documentId}, context) {

      const collection = context.Comments;

      const document = collection.findOne(documentId);
      Utils.performCheck(this.check, context.currentUser, document, context);

      return removeMutation({
        collection, 
        documentId: documentId, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

}

export default mutations;