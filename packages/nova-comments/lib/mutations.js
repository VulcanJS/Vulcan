import Telescope, { newMutation, editMutation, removeMutation } from 'meteor/nova:lib';
import Comments from './collection.js'
import Users from 'meteor/nova:users';
import Events from "meteor/nova:events";

// Resolvers
Comments.mutations = {

  commentsNew(root, {comment}, context) {
    return newMutation(context.Comments, comment, context.currentUser);
  },

  commentsEdit(root, {commentId, set, unset}, context) {
    return editMutation(context.Comments, commentId, set, unset, context.currentUser);
  },

  commentsRemove(root, {commentId}, context) {
    return removeMutation(context.Comments, commentId, context.currentUser);
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