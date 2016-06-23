import Posts from './collection.js'
import Users from 'meteor/nova:users';
import Events from "meteor/nova:events";

/**
 *
 * Post Methods
 *
 */

Posts.methods = {};
/**
 * @summary Insert a post in the database (note: optional post properties not listed here)
 * @param {Object} post - the post being inserted
 * @param {string} post.userId - the id of the user the post belongs to
 * @param {string} post.title - the post's title
 */
Posts.methods.new = function (post) {

  const currentUser = Meteor.users.findOne(post.userId);

  post = Telescope.callbacks.run("posts.new.sync", post, currentUser);

  post._id = Posts.insert(post);

  // note: query for post to get fresh document with collection-hooks effects applied
  Telescope.callbacks.runAsync("posts.new.async", Posts.findOne(post._id));

  return post;
};

/**
 * @summary Edit a post in the database
 * @param {string} postId – the ID of the post being edited
 * @param {Object} modifier – the modifier object
 * @param {Object} post - the current post object
 */
Posts.methods.edit = function (postId, modifier, post) {

  if (typeof post === "undefined") {
    post = Posts.findOne(postId);
  }

  modifier = Telescope.callbacks.run("posts.edit.sync", modifier, post);

  Posts.update(postId, modifier);

  Telescope.callbacks.runAsync("posts.edit.async", Posts.findOne(postId), post);

  return Posts.findOne(postId);
};

/**
 * @summary Increase the number of clicks on a post
 * @param {string} postId – the ID of the post being edited
 * @param {string} ip – the IP of the current user
 */
Posts.methods.increaseClicks = (postId, ip) => {

  var clickEvent = {
    name: 'click',
    properties: {
      postId: postId,
      ip: ip
    }
  };

  // make sure this IP hasn't previously clicked on this post
  var existingClickEvent = Events.findOne({name: 'click', 'properties.postId': postId, 'properties.ip': ip});

  if(!existingClickEvent){
    Events.log(clickEvent);
    Posts.update(postId, { $inc: { clickCount: 1 }});
  }
};

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

var postViews = [];

Meteor.methods({

  /**
   * @summary Meteor method for submitting a post from the client
   * NOTE: the current user and the post author user might sometimes be two different users!
   * Required properties: title
   * @memberof Posts
   * @isMethod true
   * @param {Object} post - the post being inserted
   */
  'posts.new': function(post){

    Posts.simpleSchema().namedContext("posts.new").validate(post);

    post = Telescope.callbacks.run("posts.new.method", post, Meteor.user());

    if (Meteor.isServer && this.connection) {
      post.userIP = this.connection.clientAddress;
      post.userAgent = this.connection.httpHeaders["user-agent"];
    }

    return Posts.methods.new(post);
  },

  /**
   * @summary Meteor method for editing a post from the client
   * @memberof Posts
   * @isMethod true
   * @param {Object} postId - the id of the post being updated
   * @param {Object} modifier - the update modifier
   */
  'posts.edit': function (postId, modifier) {
    
    Posts.simpleSchema().namedContext("posts.edit").validate(modifier, {modifier: true});
    check(postId, String);

    const post = Posts.findOne(postId);

    modifier = Telescope.callbacks.run("posts.edit.method", modifier, post, Meteor.user());

    return Posts.methods.edit(postId, modifier, post);

  },

  /**
   * @summary Meteor method for approving a post
   * @memberof Posts
   * @isMethod true
   * @param {String} postId - the id of the post to approve
   */
  'posts.approve': function(postId){

    check(postId, String);
    
    const post = Posts.findOne(postId);
    const now = new Date();

    if (Users.is.admin(Meteor.user())) {

      const set = {status: Posts.config.STATUS_APPROVED};

      if (!post.postedAt) {
        set.postedAt = now;
      }
      
      Posts.update(post._id, {$set: set});

      Telescope.callbacks.runAsync("posts.approve.async", post);

    } else {
      Messages.flash('You need to be an admin to do that.', "error");
    }
  },

  /**
   * @summary Meteor method for rejecting a post
   * @memberof Posts
   * @isMethod true
   * @param {String} postId - the id of the post to reject
   */
  'posts.reject': function(postId){

    check(postId, String);
    
    const post = Posts.findOne(postId);
    
    if(Users.is.admin(Meteor.user())){

      Posts.update(post._id, {$set: {status: Posts.config.STATUS_REJECTED}});

      Telescope.callbacks.runAsync("postRejectAsync", post);
    
    }else{
      Messages.flash('You need to be an admin to do that.', "error");
    }
  },

  /**
   * @summary Meteor method for increasing the number of views on a post
   * @memberof Posts
   * @isMethod true
   * @param {String} postId - the id of the post
   */
  'posts.increaseViews': function(postId, sessionId){

    check(postId, String);
    check(sessionId, Match.Any);
    
    // only let users increment a post's view counter once per session
    var view = {_id: postId, userId: this.userId, sessionId: sessionId};

    if (_.where(postViews, view).length === 0) {
      postViews.push(view);
      Posts.update(postId, { $inc: { viewCount: 1 }});
    }
  },

  /**
   * @summary Meteor method for deleting a post
   * @memberof Posts
   * @isMethod true
   * @param {String} postId - the id of the post
   */
  'posts.remove': function(postId) {

    check(postId, String);

    // remove post comments
    // if(!this.isSimulation) {
    //   Comments.remove({post: postId});
    // }
    // NOTE: actually, keep comments after all

    var post = Posts.findOne({_id: postId});

    if (!Meteor.userId() || !Users.can.editById(Meteor.userId(), post)){
      throw new Meteor.Error(606, 'You need permission to edit or delete a post');
    }

    // decrement post count
    Users.update({_id: post.userId}, {$inc: {"telescope.postCount": -1}});

    // delete post
    Posts.remove(postId);

    Telescope.callbacks.runAsync("posts.remove.async", post);

  },

  /**
   * @summary Check for other posts with the same URL
   * @memberof Posts
   * @isMethod true
   * @param {String} url - the URL to check
   */
  'posts.checkForDuplicates': function (url) {
    Posts.checkForSameUrl(url);  
  },

  /**
   * @summary Upvote a post
   * @memberof Posts
   * @isMethod true
   * @param {String} postId - the id of the post
   */
  'posts.upvote': function (postId) {
    check(postId, String);
    return Telescope.operateOnItem.call(this, Posts, postId, Meteor.user(), "upvote");
  },

  /**
   * @summary Downvote a post
   * @memberof Posts
   * @isMethod true
   * @param {String} postId - the id of the post
   */
  'posts.downvote': function (postId) {
    check(postId, String);
    return Telescope.operateOnItem.call(this, Posts, postId, Meteor.user(), "downvote");
  },


  /**
   * @summary Cancel an upvote on a post
   * @memberof Posts
   * @isMethod true
   * @param {String} postId - the id of the post
   */
  'posts.cancelUpvote': function (postId) {
    check(postId, String);
    return Telescope.operateOnItem.call(this, Posts, postId, Meteor.user(), "cancelUpvote");
  },

  /**
   * @summary Cancel a downvote on a post
   * @memberof Posts
   * @isMethod true
   * @param {String} postId - the id of the post
   */
  'posts.cancelDownvote': function (postId) {
    check(postId, String);
    return Telescope.operateOnItem.call(this, Posts, postId, Meteor.user(), "cancelDownvote");
  }

});
