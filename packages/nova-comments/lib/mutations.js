import Telescope, { newMutation, editMutation, removeMutation } from 'meteor/nova:lib';
import Comments from './collection.js'
import Users from 'meteor/nova:users';
import Events from "meteor/nova:events";

// Resolvers
Comments.mutations = {

  commentsNew(root, {document}, context) {
    return newMutation({
      action: 'comments.new',
      collection: context.Comments, 
      document: document,
      currentUser: context.currentUser,
      validate: true
    });
  },

  commentsEdit(root, {documentId, set, unset}, context) {

    const document = Comments.findOne(documentId);
    const action = Users.owns(context.currentUser, document) ? 'comments.edit.own' : 'comments.edit.all';

    return editMutation({
      action: action,
      collection: context.Comments, 
      documentId: documentId,
      set: set, 
      unset: unset, 
      currentUser: context.currentUser, 
      validate: true
    });
  },

  commentsRemove(root, {documentId}, context) {

    const document = Comments.findOne(documentId);
    const action = Users.owns(context.currentUser, document) ? 'comments.remove.own' : 'comments.remove.all';

    return removeMutation({
      action: action,
      collection: context.Comments, 
      documentId: documentId, 
      currentUser: context.currentUser,
      validate: true
    });
  },

  commentsVote(root, {documentId, voteType}, context) {

  },

};

// GraphQL mutations
Telescope.graphQL.addMutation('commentsNew(document: commentsInput) : Comment');
Telescope.graphQL.addMutation('commentsEdit(documentId: String, set: commentsInput, unset: commentsUnset) : Comment');
Telescope.graphQL.addMutation('commentsRemove(documentId: String) : Comment');
Telescope.graphQL.addMutation('commentsVote(documentId: String, voteType: String) : Comment');

export default Comments.mutations;