// The equation to determine voting power. Defaults to returning 1 for everybody
Telescope.getVotePower = function (user) {
  return 1;
};

Telescope.upvoteItem = function (collection, itemId, user) {

  user = typeof user === "undefined" ? Meteor.user() : user;
  var item = collection.findOne(itemId);
  var votePower = Telescope.getVotePower(user);

  /* 
  we're testing if
  1. the user exists
  2. they can vote
  3. they haven't previously performed the same operation on this item
  */

  // make sure user has rights to upvote first
  if (!user || !user.canVote() || user.hasUpvotedItem(item))
    return false;

  // ------------------------------ Callbacks ------------------------------ //
  item = Telescope.callbacks.run("upvote", item, user);

  // in case user is upvoting a previously downvoted item, cancel downvote first
  Telescope.cancelDownvote(collection, itemId, user);

  // Votes & Score
  var result = collection.update({_id: item && item._id, upvoters: { $ne: user._id }},{
    $addToSet: {upvoters: user._id},
    $inc: {upvotes: 1, baseScore: votePower},
    $set: {inactive: false}
  });

  if (result > 0) {
    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore + votePower)});
    // --------------------- Server-Side Async Callbacks --------------------- //
    Telescope.callbacks.runAsync("upvoteAsync", item, user, collection, "upvote");
  }

  return true;
};

Telescope.downvoteItem = function (collection, itemId, user) {

  user = typeof user === "undefined" ? Meteor.user() : user;
  var item = collection.findOne(itemId);
  var votePower = Telescope.getVotePower(user);

  // make sure user has rights to downvote first
  if (!user || !user.canVote()  || user.hasDownvotedItem(item))
    return false;

  // ------------------------------ Callbacks ------------------------------ //
  item = Telescope.callbacks.run("downvote", item, user);

  // in case user is downvoting a previously upvoted item, cancel upvote first
  Telescope.cancelUpvote(collection, item, user);

  // Votes & Score
  var result = collection.update({_id: item && item._id, downvoters: { $ne: user._id }},{
    $addToSet: {downvoters: user._id},
    $inc: {downvotes: 1, baseScore: -votePower},
    $set: {inactive: false}
  });

  if (result > 0) {
    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore - votePower)});
    // --------------------- Server-Side Async Callbacks --------------------- //
    Telescope.callbacks.runAsync("downvoteAsync", item, user, collection, "downvote");
  }

  return true;
};

Telescope.cancelUpvote = function (collection, itemId, user) {

  user = typeof user === "undefined" ? Meteor.user() : user;
  var item = collection.findOne(itemId);
  var votePower = Telescope.getVotePower(user);

  // if user isn't among the upvoters, abort
  if (!user.hasUpvotedItem(item))
    return false;

  // ------------------------------ Callbacks ------------------------------ //
  item = Telescope.callbacks.run("cancelUpvote", item, user, collection, "cancelUpvote");

  // Votes & Score
  var result = collection.update({_id: item && item._id, upvoters: user._id},{
    $pull: {upvoters: user._id},
    $inc: {upvotes: -1, baseScore: -votePower},
    $set: {inactive: false}
  });

  if (result > 0) {
    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore - votePower)});
    // --------------------- Server-Side Async Callbacks --------------------- //
    Telescope.callbacks.runAsync("cancelUpvoteAsync", item, user, collection, "cancelDownvote");
  }
  // console.log(collection.findOne(item._id));
  return true;
};

Telescope.cancelDownvote = function (collection, itemId, user) {

  user = typeof user === "undefined" ? Meteor.user() : user;
  var item = collection.findOne(itemId);
  var votePower = Telescope.getVotePower(user);

  // if user isn't among the downvoters, abort
  if (!user.hasDownvotedItem(item))
    return false;

  // ------------------------------ Callbacks ------------------------------ //
  item = Telescope.callbacks.run("cancelDownvote", item, user);

  // Votes & Score
  var result = collection.update({_id: item && item._id, downvoters: user._id},{
    $pull: {downvoters: user._id},
    $inc: {downvotes: -1, baseScore: votePower},
    $set: {inactive: false}
  });

  if (result > 0) {
    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore + votePower)});
    // --------------------- Server-Side Async Callbacks --------------------- //
    Telescope.callbacks.runAsync("cancelDownvoteAsync", item, user);
  }

  return true;
};

Meteor.methods({
  upvotePost: function (postId) {
    check(postId, String);
    return Telescope.upvoteItem.call(this, Posts, postId);
  },
  downvotePost: function (postId) {
    check(postId, String);
    return Telescope.downvoteItem.call(this, Posts, postId);
  },
  cancelUpvotePost: function (postId) {
    check(postId, String);
    return Telescope.cancelUpvote.call(this, Posts, postId);
  },
  cancelDownvotePost: function (postId) {
    check(postId, String);
    return Telescope.cancelDownvote.call(this, Posts, postId);
  },
  upvoteComment: function (commentId) {
    check(commentId, String);
    return Telescope.upvoteItem.call(this, Comments, commentId);
  },
  downvoteComment: function (commentId) {
    check(commentId, String);
    return Telescope.downvoteItem.call(this, Comments, commentId);
  },
  cancelUpvoteComment: function (commentId) {
    check(commentId, String);
    return Telescope.cancelUpvote.call(this, Comments, commentId);
  },
  cancelDownvoteComment: function (commentId) {
    check(commentId, String);
    return Telescope.cancelDownvote.call(this, Comments, commentId);
  }
});
