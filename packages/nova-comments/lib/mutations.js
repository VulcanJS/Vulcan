import Telescope, { newMutation, editMutation, removeMutation } from 'meteor/nova:lib';
import Comments from './collection.js'
import Users from 'meteor/nova:users';
import Events from "meteor/nova:events";

// Resolvers
Comments.mutations = {

  commentsNew(root, {comment}, context) {
    return newMutation({
      collection: context.Comments, 
      document: comment,
      currentUser: context.currentUser,
      validate: true
    });
  },

  commentsEdit(root, {commentId, set, unset}, context) {
    return editMutation({
      collection: context.Comments, 
      documentId: commentId,
      set: set, 
      unset: unset, 
      currentUser: context.currentUser, 
      validate: true
    });
  },

  commentsRemove(root, {commentId}, context) {
    return removeMutation({
      collection: context.Comments, 
      documentId: commentId, 
      currentUser: context.currentUser,
      validate: true
    });
  },

  commentsVote(root, {commentId, voteType}, context) {

  },

};

// GraphQL mutations
Telescope.graphQL.addMutation('commentsNew(comment: CommentInput) : Comment');
Telescope.graphQL.addMutation('commentsEdit(commentId: String, set: CommentInput, unset: CommentUnsetModifier) : Comment');
Telescope.graphQL.addMutation('commentsRemove(commentId: String) : Comment');
Telescope.graphQL.addMutation('commentsVote(commentId: String, voteType: String) : Comment');

export default Comments.mutations;