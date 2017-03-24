import { newMutation, editMutation, removeMutation, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const performCheck = (mutation, user, document) => {
  if (!mutation.check(user, document)) throw new Error(Utils.encodeIntlError({id: `app.mutation_not_allowed`, value: `"${mutation.name}" on _id "${document._id}"`}));
};

const mutations = {

  new: {
    
    name: 'commentsNew',
    
    check(user, document) {
      if (!user) return false;
      return Users.canDo(user, 'comments.new');
    },
    
    mutation(root, {document}, context) {
      
      performCheck(this, context.currentUser, document);

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
      performCheck(this, context.currentUser, document);

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
      performCheck(this, context.currentUser, document);

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
