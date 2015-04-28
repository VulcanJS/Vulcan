

// object containing post list view parameters
Telescope.viewParameters = {};

// will be common to all other view unless specific properties are overwritten
Telescope.viewParameters.baseParameters = {
  find: {
    status: STATUS_APPROVED
  },
  options: {
    limit: 10
  }
};

Telescope.viewParameters.top = function (terms) {
  return {
    options: {sort: {sticky: -1, score: -1}}
  };
};

Telescope.viewParameters.new = function (terms) {
  return {
    options: {sort: {sticky: -1, postedAt: -1}}
  };
};

Telescope.viewParameters.best = function (terms) {
  return {
    options: {sort: {sticky: -1, baseScore: -1}}
  };
};

Telescope.viewParameters.pending = function (terms) {
  return {
    find: {
      status: 1
    },
    options: {sort: {createdAt: -1}},
    showFuture: true
  };
};

Telescope.viewParameters.scheduled = function (terms) {
  return {
    find: {postedAt: {$gte: new Date()}},
    options: {sort: {postedAt: -1}}
  };
};

Telescope.viewParameters.userPosts = function (terms) {
  return {
    find: {userId: terms.userId},
    options: {limit: 5, sort: {postedAt: -1}}
  };
};

Telescope.viewParameters.userUpvotedPosts = function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var postsIds = _.pluck(user.telescope.upvotedPosts, "itemId");
  return {
    find: {_id: {$in: postsIds}, userId: {$ne: terms.userId}}, // exclude own posts
    options: {limit: 5, sort: {postedAt: -1}}
  };
};

Telescope.viewParameters.userDownvotedPosts = function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var postsIds = _.pluck(user.telescope.downvotedPosts, "itemId");
  // TODO: sort based on votedAt timestamp and not postedAt, if possible
  return {
    find: {_id: {$in: postsIds}},
    options: {limit: 5, sort: {postedAt: -1}}
  };
};