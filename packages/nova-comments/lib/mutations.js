import Telescope from 'meteor/nova:lib';
import Comments from './collection.js'
import Users from 'meteor/nova:users';
import Events from "meteor/nova:events";

/**
 *
 * Post Methods (and Mutations)
 *
 */

// define GraphQL mutations

Telescope.graphQL.addMutation('commentsNew(comment: CommentInput) : Comment');
Telescope.graphQL.addMutation('commentsEdit(commentId: String, set: CommentInput, unset: CommentUnsetModifier) : Comment');
Telescope.graphQL.addMutation('commentsVote(commentId: String, voteType: String) : Comment');

// resolvers

Comments.mutations = {

  commentsNew(root, {comment}, context) {

   

  },

  commentsEdit(root, {commentId, set, unset}, context) {

      
  },

  commentsVote(root, {commentId, voteType}, context) {

  },

};

export default Comments.mutations;