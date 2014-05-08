
  // returns how much "power" a user's votes have
  var getVotePower = function(user){
    // return (user && user.isAdmin) ? 5 : 1;
    return 1; // for now, leave everybody at 1 including admins; 5 is too unbalanced
  };

  var modifyKarma = function(userId, karma){
    Meteor.users.update({_id: userId}, {$inc: {karma: karma}});
  };

  var hasUpvotedItem= function(item, user){
    return item.upvoters && item.upvoters.indexOf(user._id) != -1;
  };

  var hasDownvotedItem= function(item, user){
    return item.downvoters && item.downvoters.indexOf(user._id) != -1;
  };

  var upvoteItem = function(collection, item) {
    var user = Meteor.user(),
        votePower = getVotePower(user);

    // make sure user has rights to upvote first
    if (!user || !canUpvote(user, collection, true)  || hasUpvotedItem(item, user))
      return false;

    // if user is upvoting a previously downvoted item, cancel downvote first
    if (hasDownvotedItem(item, user))
      cancelDownvote(collection, item, user);

    // Votes & Score
    var result = collection.update({_id: item && item._id},{
      $addToSet: {upvoters: user._id},
      $pull: {downvoters: user._id},
      $inc: {votes: 1, baseScore: votePower},
      $set: {inactive: false}
    });

    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore + votePower)});
    updateScore({collection: collection, item: item, forceUpdate: true});

    // if the item is being upvoted by its own author, don't give karma
    if (item.userId != user._id){
      modifyKarma(item.userId, votePower);
      
      // if karma redistribution is enabled, give karma to all previous upvoters of the post 
      // (but not to the person doing the upvoting)
      if(getSetting('redistributeKarma', false)){
        _.each(item.upvoters, function(upvoterId){
          // share the karma equally among all upvoters, but cap the value at 0.1
          var karmaIncrease = Math.min(0.1, votePower/item.upvoters.length);
          modifyKarma(upvoterId, 0.1);
        });
      }
    }
    return true;
  };

  var downvoteItem = function(collection, item) {
    var user = Meteor.user(),
        votePower = getVotePower(user);

    // make sure user has rights to downvote first
    if (!user || !canDownvote(user, collection, true)  || hasDownvotedItem(item, user))
      return false;

    // if user is downvoting a previously upvoted item, cancel upvote first
    if (hasUpvotedItem(item, user))
      cancelUpvote(collection, item, user);

    // Votes & Score
    collection.update({_id: item && item._id},{
      $addToSet: {downvoters: user._id},
      $pull: {upvoters: user._id},
      $inc: {votes: -1, baseScore: -votePower},
      $set: {inactive: false}
    });

    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore + votePower)});
    updateScore({collection: collection, item: item, forceUpdate: true});

    // if the item is being upvoted by its own author, don't give karma
    if (item.userId != user._id)
      modifyKarma(item.userId, votePower);

    return true;
  };

  var cancelUpvote = function(collection, item) {
    var user = Meteor.user();
        votePower = getVotePower(user);

    // if user isn't among the upvoters, abort
    if(!hasUpvotedItem(item, user))
      return false;

    // Votes & Score
    collection.update({_id: item && item._id},{
      $pull: {upvoters: user._id},
      $inc: {votes: -1, baseScore: -votePower},
      $set: {inactive: false}
    });

    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore + votePower)});
    updateScore({collection: collection, item: item, forceUpdate: true});

    // if the item is being upvoted by its own author, don't give karma
    if (item.userId != user._id)
      modifyKarma(item.userId, votePower);
    
    return true;
  };

  var cancelDownvote = function(collection, item) {
    var user = Meteor.user(),
      votePower = getVotePower(user);

    // if user isn't among the downvoters, abort
    if(!hasUpvotedItem(item, user))
      return false;
    
    // Votes & Score
    collection.update({_id: item && item._id},{
      $pull: {downvoters: user._id},
      $inc: {votes: 1, baseScore: votePower},
      $set: {inactive: false}
    });
    
    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore + votePower)});
    updateScore({collection: collection, item: item, forceUpdate: true});

    // if the item is being upvoted by its own author, don't give karma
    if (item.userId != user._id)
      modifyKarma(item.userId, votePower);
    
    return true;
  };

  // note: doesn't actually seem very useful to enable admins to vote for other users. Remove this?
  var getUser = function(user){
    // only let admins specify different users for voting
    // if no user is specified, use current user by default
    return (isAdmin(Meteor.user()) && typeof user !== 'undefined') ? user : Meteor.user();
  };
  
  Meteor.methods({
    upvotePost: function(post, user){
      return upvoteItem.call(this, Posts, post);
    },
    downvotePost: function(post, user){
      return downvoteItem.call(this, Posts, post);
    },
    cancelUpvotePost: function(post, user){
      return cancelUpvote.call(this, Posts, post);
    },
    cancelDownvotePost: function(post, user){
      return cancelDownvote.call(this, Posts, post);
    },
    upvoteComment: function(comment, user){
      return upvoteItem.call(this, Comments, comment);
    },
    downvoteComment: function(comment, user){
      return downvoteItem.call(this, Comments, comment);
    },
    cancelUpvoteComment: function(comment, user){
      return cancelUpvote.call(this, Comments, comment);
    },
    cancelDownvoteComment: function(comment, user){
      return cancelDownvote.call(this, Comments, comment);
    }
  });
