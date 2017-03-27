/*

Define the three default mutations:

- new (e.g.: commentsNew(document: commentsInput) : Movie )
- edit (e.g.: commentsEdit(documentId: String, set: commentsInput, unset: commentsUnset) : Movie )
- remove (e.g.: commentsRemove(documentId: String) : Movie )

Each mutation has:

- A name
- A check function that takes the current user and (optionally) the document affected
- The actual mutation

*/

import { newMutation, editMutation, removeMutation, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const mutations = {

  new: {
    
    name: 'commentsNew',
    
    check(user) {
      if (!user) return false;
      return Users.canDo(user, 'comments.new');
    },
    
    mutation(root, {document}, context) {
      
      Utils.performCheck(this, context.currentUser, document);

      return newMutation({
        collection: context.Comments,
        document: document, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {
    
    name: 'commentsEdit',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'comments.edit.own') : Users.canDo(user, `comments.edit.all`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.Comments.findOne(documentId);
      Utils.performCheck(this, context.currentUser, document);

      return editMutation({
        collection: context.Comments, 
        documentId: documentId, 
        set: set, 
        unset: unset, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },
  
  remove: {

    name: 'commentsRemove',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'comments.remove.own') : Users.canDo(user, `comments.remove.all`);
    },
    
    mutation(root, {documentId}, context) {

      const document = context.Comments.findOne(documentId);
      Utils.performCheck(this, context.currentUser, document);

      return removeMutation({
        collection: context.Comments, 
        documentId: documentId, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};

export default mutations;
