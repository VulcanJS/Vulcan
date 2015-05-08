/**
 * Post views are filters used for subscribing to and viewing posts
 * @namespace Posts.views
 */
Posts.views = {};

/**
 * Add a post view
 * @param {string} viewName - The name of the view
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */
Posts.views.register = function (viewName, viewFunction) {
  Posts.views[viewName] = viewFunction;
};

// will be common to all other view unless specific properties are overwritten
Posts.views.baseParameters = {
  find: {
    status: Posts.config.STATUS_APPROVED
  },
  options: {
    limit: 10
  }
};

Posts.views.register("top", function (terms) {
  return {
    options: {sort: {sticky: -1, score: -1}}
  };
});

Posts.views.register("new", function (terms) {
  return {
    options: {sort: {sticky: -1, postedAt: -1}}
  };
});

Posts.views.register("best", function (terms) {
  return {
    options: {sort: {sticky: -1, baseScore: -1}}
  };
});

Posts.views.register("pending", function (terms) {
  return {
    find: {
      status: 1
    },
    options: {sort: {createdAt: -1}},
    showFuture: true
  };
});

Posts.views.register("scheduled", function (terms) {
  return {
    find: {postedAt: {$gte: new Date()}},
    options: {sort: {postedAt: -1}}
  };
});

Posts.views.register("userPosts", function (terms) {
  return {
    find: {userId: terms.userId},
    options: {limit: 5, sort: {postedAt: -1}}
  };
});

Posts.views.register("userUpvotedPosts", function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var postsIds = _.pluck(user.telescope.upvotedPosts, "itemId");
  return {
    find: {_id: {$in: postsIds}, userId: {$ne: terms.userId}}, // exclude own posts
    options: {limit: 5, sort: {postedAt: -1}}
  };
});

Posts.views.register("userDownvotedPosts", function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var postsIds = _.pluck(user.telescope.downvotedPosts, "itemId");
  // TODO: sort based on votedAt timestamp and not postedAt, if possible
  return {
    find: {_id: {$in: postsIds}},
    options: {limit: 5, sort: {postedAt: -1}}
  };
});