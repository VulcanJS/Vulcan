import Telescope from 'meteor/nova:lib';
import Posts from './collection.js'
import Users from 'meteor/nova:users';
import Events from "meteor/nova:events";

/**
 *
 * Post Methods (and Mutations)
 *
 */

// define GraphQL mutations

Telescope.graphQL.addMutation('postsNew(post: PostInput) : Post');
Telescope.graphQL.addMutation('postsEdit(postId: String, set: PostSetModifier, unset: PostUnsetModifier) : Post');
Telescope.graphQL.addMutation('postsVote(postId: String, voteType: String) : Post');

// resolvers

Posts.mutations = {

  postsNew(root, {post}, context) {

    console.log("// postsNew")
    console.log(post)

    context.Posts.simpleSchema().namedContext("posts.new").validate(post);

    // post = Telescope.callbacks.run("posts.new.method", post, Meteor.user());

    if (Meteor.isServer && this.connection) {
      post.userIP = this.connection.clientAddress;
      post.userAgent = this.connection.httpHeaders["user-agent"];
    }

    post = Telescope.callbacks.run("posts.new.sync", post, context.currentUser);

    post._id = context.Posts.insert(post);

    // note: query for post to get fresh document with collection-hooks effects applied
    Telescope.callbacks.runAsync("posts.new.async", context.Posts.findOne(post._id));

    return post;

  },

  postsEdit(root, parameters, context) {

      console.log("// postsEdit")
      console.log(parameters)

      let {postId, set, unset} = parameters;

      let modifier = {$set: set, $unset: unset};

      context.Posts.simpleSchema().namedContext("posts.edit").validate(modifier, {modifier: true});
      check(postId, String);

      let post = context.Posts.findOne(postId);

      // modifier = Telescope.callbacks.run("posts.edit.method", modifier, post, Meteor.user());

      if (typeof post === "undefined") {
        post = context.Posts.findOne(postId);
      }

      modifier = Telescope.callbacks.run("posts.edit.sync", modifier, post);

      context.Posts.update(postId, modifier);

      Telescope.callbacks.runAsync("posts.edit.async", context.Posts.findOne(postId), post);

      return context.Posts.findOne(postId);
  },

  postsVote(root, {postId, voteType}, context) {
    Meteor._sleepForMs(2000); // wait 2 seconds for demonstration purpose
    console.log("sleep done");
    const post = Posts.findOne(postId);
    return context.Users.canDo(context.currentUser, `posts.${voteType}`) ? Telescope.operateOnItem(context.Posts, post, context.currentUser, voteType) : false;
  },

};

export default Posts.mutations;