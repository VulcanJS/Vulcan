import Telescope, { newMutation, editMutation, removeMutation } from 'meteor/nova:lib';
import Posts from './collection.js'
import Users from 'meteor/nova:users';
import Events from "meteor/nova:events";

// Resolvers
Posts.mutations = {

  postsNew(root, {document}, context) {
    return newMutation({
      collection: context.Posts, 
      document: document, 
      currentUser: context.currentUser,
      validate: true
    });
  },

  postsEdit(root, {documentId, set, unset}, context) {
    return editMutation({
      collection: context.Posts, 
      documentId: documentId, 
      set: set, 
      unset: unset, 
      currentUser: context.currentUser,
      validate: true
    });
  },

  postsRemove(root, {documentId}, context) {
    return removeMutation({
      collection: context.Posts, 
      documentId: documentId, 
      currentUser: context.currentUser,
      validate: true
    });
  },

  postsVote(root, {documentId, voteType}, context) {
    Meteor._sleepForMs(2000); // wait 2 seconds for demonstration purpose
    console.log("sleep done");
    const post = Posts.findOne(documentId);
    return context.Users.canDo(context.currentUser, `posts.${voteType}`) ? Telescope.operateOnItem(context.Posts, post, context.currentUser, voteType) : false;
  },

};

// GraphQL mutations
Telescope.graphQL.addMutation('postsNew(document: postsInput) : Post');
Telescope.graphQL.addMutation('postsEdit(documentId: String, set: postsInput, unset: postsUnset) : Post');
Telescope.graphQL.addMutation('postsRemove(documentId: String) : Post');
Telescope.graphQL.addMutation('postsVote(documentId: String, voteType: String) : Post');

export default Posts.mutations;