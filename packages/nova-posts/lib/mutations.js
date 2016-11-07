import Telescope, { newMutation, editMutation, removeMutation } from 'meteor/nova:lib';
import Posts from './collection.js'
import Users from 'meteor/nova:users';
import Events from "meteor/nova:events";

// Resolvers
Posts.mutations = {

  postsNew(root, {post}, context) {
    return newMutation(context.Posts, post, context.currentUser);
  },

  postsEdit(root, {postId, set, unset}, context) {
    return editMutation(context.Posts, postId, set, unset, context.currentUser);
  },

  postsRemove(root, {postId}, context) {
    return removeMutation(context.Posts, postId, context.currentUser);
  },

  postsVote(root, {postId, voteType}, context) {
    Meteor._sleepForMs(2000); // wait 2 seconds for demonstration purpose
    console.log("sleep done");
    const post = Posts.findOne(postId);
    return context.Users.canDo(context.currentUser, `posts.${voteType}`) ? Telescope.operateOnItem(context.Posts, post, context.currentUser, voteType) : false;
  },

};

// GraphQL mutations
Telescope.graphQL.addMutation('postsNew(post: PostInput) : Post');
Telescope.graphQL.addMutation('postsEdit(postId: String, set: PostInput, unset: PostUnsetModifier) : Post');
Telescope.graphQL.addMutation('postsRemove(postId: String) : Post');
Telescope.graphQL.addMutation('postsVote(postId: String, voteType: String) : Post');

export default Posts.mutations;