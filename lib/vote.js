
// getVotePower returns how much "power" a user's votes have
// It is can be set in a package, by setting getVotePower to a Number or Function then re-exporting
// The default is found in base.js in the base package, and returns 1.

var modifyKarma = function (userId, karma) {
  Meteor.users.update({_id: userId}, {$inc: {karma: karma}});
};

var hasUpvotedItem = function (item, user) {
  return item.upvoters && item.upvoters.indexOf(user._id) != -1;
};

var hasDownvotedItem = function (item, user) {
  return item.downvoters && item.downvoters.indexOf(user._id) != -1;
};

var addVote = function (userId, vote, collection, upOrDown) {
  var field = 'votes.' + upOrDown + 'voted' + collection;
  var add = {};
  add[field] = vote;
  var result = Meteor.users.update({_id: userId}, {
    $addToSet: add
  });
};

var removeVote = function (userId, itemId, collection, upOrDown) {
  var field = 'votes.' + upOrDown + 'voted' + collection;
  var remove = {};
  remove[field] = {itemId: itemId};
  Meteor.users.update({_id: userId}, {
    $pull: remove
  });
};

upvoteItem = function (collection, item, user) {
  user = typeof user === "undefined" ? Meteor.user() : user;
  collectionName = collection._name.slice(0,1).toUpperCase()+collection._name.slice(1);

  // make sure user has rights to upvote first
  if (!user || !can.vote(user, true) || hasUpvotedItem(item, user))
    return false;

  // ------------------------------ Callbacks ------------------------------ //

  // run all upvote callbacks on item successively
  item = upvoteMethodCallbacks.reduce(function(result, currentFunction) {
    return currentFunction(collection, result, user);
  }, item);

  // ----------------------------------------------------------------------- //

  votePower = getVotePower(user);

  // in case user is upvoting a previously downvoted item, cancel downvote first
  cancelDownvote(collection, item, user);

  // Votes & Score
  var result = collection.update({_id: item && item._id, upvoters: { $ne: user._id }},{
    $addToSet: {upvoters: user._id},
    $inc: {upvotes: 1, baseScore: votePower},
    $set: {inactive: false}
  });

  if (result > 0) {

    // Add item to list of upvoted items
    var vote = {
      itemId: item._id,
      votedAt: new Date(),
      power: votePower
    };
    addVote(user._id, vote, collectionName, 'up');

    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore + votePower)});
    updateScore({collection: collection, item: item, forceUpdate: true});

    // if the item is being upvoted by its own author, don't give karma
    if (item.userId != user._id) {
      modifyKarma(item.userId, votePower);

      // if karma redistribution is enabled, give karma to all previous upvoters of the post
      // (but not to the person doing the upvoting)
      if (Settings.get('redistributeKarma', false)) {
        _.each(item.upvoters, function (upvoterId) {
          // share the karma equally among all upvoters, but cap the value at 0.1
          var karmaIncrease = Math.min(0.1, votePower/item.upvoters.length);
          modifyKarma(upvoterId, 0.1);
        });
      }
    }


    // --------------------- Server-Side Async Callbacks --------------------- //

    if (Meteor.isServer) {
      Meteor.defer(function () { // use defer to avoid holding up client
        // run all post submit server callbacks on post object successively
        result = upvoteCallbacks.reduce(function(result, currentFunction) {
            return currentFunction(collection, result, user);
        }, item);
      });
    }
    // ----------------------------------------------------------------------- //
  }
  // console.log(collection.findOne(item._id));
  return true;
};

downvoteItem = function (collection, item, user) {
  user = typeof user === "undefined" ? Meteor.user() : user;
  collectionName = collection._name.slice(0,1).toUpperCase()+collection._name.slice(1);

  // make sure user has rights to downvote first
  if (!user || !can.vote(user, true)  || hasDownvotedItem(item, user))
    return false;

  // ------------------------------ Callbacks ------------------------------ //

  // run all downvote callbacks on item successively
  item = downvoteMethodCallbacks.reduce(function(result, currentFunction) {
    return currentFunction(collection, result, user);
  }, item);

  // ----------------------------------------------------------------------- //

  votePower = getVotePower(user);

  // in case user is downvoting a previously upvoted item, cancel upvote first
  cancelUpvote(collection, item, user);

  // Votes & Score
  var result = collection.update({_id: item && item._id, downvoters: { $ne: user._id }},{
    $addToSet: {downvoters: user._id},
    $inc: {downvotes: 1, baseScore: -votePower},
    $set: {inactive: false}
  });

  if (result > 0) {
    // Add item to list of downvoted items
    var vote = {
      itemId: item._id,
      votedAt: new Date(),
      power: votePower
    };
    addVote(user._id, vote, collectionName, 'down');

    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore - votePower)});
    updateScore({collection: collection, item: item, forceUpdate: true});

    // if the item is being upvoted by its own author, don't give karma
    if (item.userId != user._id)
      modifyKarma(item.userId, votePower);

    // --------------------- Server-Side Async Callbacks --------------------- //

    if (Meteor.isServer) {
      Meteor.defer(function () { // use defer to avoid holding up client
        // run all post submit server callbacks on post object successively
        result = downvoteCallbacks.reduce(function(result, currentFunction) {
            return currentFunction(collection, result, user);
        }, result);
      });
    }
    // ----------------------------------------------------------------------- //
  }
  // console.log(collection.findOne(item._id));
  return true;
};

cancelUpvote = function (collection, item, user) {
  user = typeof user === "undefined" ? Meteor.user() : user;
  collectionName = collection._name.slice(0,1).toUpperCase()+collection._name.slice(1);

  // if user isn't among the upvoters, abort
  if (!hasUpvotedItem(item, user))
    return false;

  // ------------------------------ Callbacks ------------------------------ //

  // run all cancel upvote callbacks on item successively
  item = cancelUpvoteMethodCallbacks.reduce(function(result, currentFunction) {
    return currentFunction(collection, result, user);
  }, item);

  // ----------------------------------------------------------------------- //

  votePower = getVotePower(user);

  // Votes & Score
  var result = collection.update({_id: item && item._id, upvoters: user._id},{
    $pull: {upvoters: user._id},
    $inc: {upvotes: -1, baseScore: -votePower},
    $set: {inactive: false}
  });

  if (result > 0) {
    // Remove item from list of upvoted items
    removeVote(user._id, item._id, collectionName, 'up');

    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore - votePower)});
    updateScore({collection: collection, item: item, forceUpdate: true});

    // if the item is being upvoted by its own author, don't give karma
    if (item.userId != user._id)
      modifyKarma(item.userId, votePower);


    // --------------------- Server-Side Async Callbacks --------------------- //

    if (Meteor.isServer) {
      Meteor.defer(function () { // use defer to avoid holding up client
        // run all post submit server callbacks on post object successively
        result = cancelUpvoteCallbacks.reduce(function(result, currentFunction) {
            return currentFunction(collection, result, user);
        }, result);
      });
    }
    // ----------------------------------------------------------------------- //
  }
  // console.log(collection.findOne(item._id));
  return true;
};

cancelDownvote = function (collection, item, user) {
  user = typeof user === "undefined" ? Meteor.user() : user;
  collectionName = collection._name.slice(0,1).toUpperCase()+collection._name.slice(1);

  // if user isn't among the downvoters, abort
  if (!hasDownvotedItem(item, user))
    return false;

  // ------------------------------ Callbacks ------------------------------ //

  // run all cancel downvote callbacks on item successively
  item = cancelDownvoteMethodCallbacks.reduce(function(result, currentFunction) {
    return currentFunction(collection, result, user);
  }, item);

  // ----------------------------------------------------------------------- //

  votePower = getVotePower(user);

  // Votes & Score
  var result = collection.update({_id: item && item._id, downvoters: user._id},{
    $pull: {downvoters: user._id},
    $inc: {downvotes: 1, baseScore: votePower},
    $set: {inactive: false}
  });

  if (result > 0) {
    // Remove item from list of downvoted items
    removeVote(user._id, item._id, collectionName, 'down');

    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore + votePower)});
    updateScore({collection: collection, item: item, forceUpdate: true});

    // if the item is being upvoted by its own author, don't give karma
    if (item.userId != user._id)
      modifyKarma(item.userId, votePower);


    // --------------------- Server-Side Async Callbacks --------------------- //

    if (Meteor.isServer) {
      Meteor.defer(function () { // use defer to avoid holding up client
        // run all post submit server callbacks on post object successively
        result = cancelDownvoteCallbacks.reduce(function(result, currentFunction) {
            return currentFunction(collection, result, user);
        }, result);
      });
    }
    // ----------------------------------------------------------------------- //
  }
  // console.log(collection.findOne(item._id));
  return true;
};

// note: doesn't actually seem very useful to enable admins to vote for other users. Remove this?
var getUser = function (user) {
  // only let admins specify different users for voting
  // if no user is specified, use current user by default
  return (isAdmin(Meteor.user()) && typeof user !== 'undefined') ? user : Meteor.user();
};

Meteor.methods({
  upvotePost: function (post) {
    return upvoteItem.call(this, Posts, post);
  },
  downvotePost: function (post) {
    return downvoteItem.call(this, Posts, post);
  },
  cancelUpvotePost: function (post) {
    return cancelUpvote.call(this, Posts, post);
  },
  cancelDownvotePost: function (post) {
    return cancelDownvote.call(this, Posts, post);
  },
  upvoteComment: function (comment) {
    return upvoteItem.call(this, Comments, comment);
  },
  downvoteComment: function (comment) {
    return downvoteItem.call(this, Comments, comment);
  },
  cancelUpvoteComment: function (comment) {
    return cancelUpvote.call(this, Comments, comment);
  },
  cancelDownvoteComment: function (comment) {
    return cancelDownvote.call(this, Comments, comment);
  }
});
