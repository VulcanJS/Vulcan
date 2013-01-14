(function() {
  // returns how much "power" a user's votes have
  var getVotePower = function(user){
    return (user && user.isAdmin) ? 5 : 1;
  };

  var modifyKarma = function(user_id, karma){
    Meteor.users.update({_id: user_id}, {$inc: {karma: karma}});
  };

  var hasUpvotedItem= function(user, collection, id){
    // see http://www.mongodb.org/display/DOCS/MongoDB+Data+Modeling+and+Rails
    // 'is there an item with this id which contains this userId in its upvoters?'
    // if such an item  exists, it means we have voted.
    return collection.findOne({_id: id, upvoters: user._id}) !== undefined;
  }

  var hasDownvotedItem= function(user, collection, id){
    return collection.findOne({_id: id, downvoters: user._id}) !== undefined;
  }

  var upvote = function(collection, id) {
    // get user from post and not current user in case admin is posting for somebody else
    var user = Meteor.users.findOne(collection.findOne(id).userId);
    if (!user || !canUpvote(user, collection, true)  || hasUpvotedItem(user, collection, id))
      return false;

    var votePower=getVotePower(user);
    var votedItem = collection.findOne(id);

    // Votes & Score
    collection.update({_id: id},{
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1, baseScore: votePower},
      $set: {inactive: false}
    });
    if(!this.isSimulation)
      updateScore(collection, id, true);

    // Karma     
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != user._id) {
      modifyKarma(votedItem.user_id, votePower);
    }
    
    return true;
  };

  var downvote = function(collection, id) {
    var user = Meteor.user();
    if (! user || !canDownvote(user, collection, 'redirect') || hasDownvotedItem(user, collection, id))
      return false;
    
    var votePower=getVotePower(user);
    var votedItem = collection.findOne(id);

    // Votes & Score
    collection.update({_id: id},{
      $addToSet: {downvoters: user._id},
      $inc: {votes: -1, baseScore: -votePower},
      $set: {inactive: false}
    });
    if(!this.isSimulation)  
      updateScore(collection, id, true);

    // Karma
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != user._id) {
      modifyKarma(votedItem.user_id, -votePower);
    }

    return true;
  };

  var cancelUpvote = function(collection, id) {
    var user = Meteor.user();
    if (! user || !canUpvote(user, collection, 'redirect') || ! hasUpvotedItem(user, collection, id))
      return false
    
    var votePower=getVotePower(user);
    var votedItem = collection.findOne(id);
   
    // Votes & Score
    collection.update({_id: id},{
      $pull: {upvoters: user._id},
      $inc: {votes: -1, baseScore: -votePower},
      $set: {inactive: false}
    });
    if(!this.isSimulation)
      updateScore(collection, id, true);

    // Karma
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != user._id) {
      modifyKarma(votedItem.user_id, -votePower);
    }
    
    return true;
  };

  var cancelDownvote = function(collection, id) {
    var user = Meteor.user();
    if (! user || !canDownvote(user, collection, 'redirect') || ! hasDownvotedItem(user, collection, id))
      return false

    var votePower=getVotePower(user);
    var votedItem = collection.findOne(id);
    
    // Votes & Score
    collection.update({_id: id},{
      $pull: {downvoters: user._id},
      $inc: {votes: 1, baseScore: votePower},
      $set: {inactive: false}
    });
    if(!this.isSimulation)
      updateScore(collection, id, true);

    // Karma
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != user._id) {
      modifyKarma(votedItem.user_id, votePower);
    }
    
    return true;
  };

  Meteor.methods({
    upvotePost: function(postId){
      return upvote.call(this, Posts, postId);
    },
    downvotePost: function(postId){
      return downvote.call(this, Posts, postId);
    },
    cancelUpvotePost: function(postId){
      return cancelUpvote.call(this, Posts, postId);
    },
    cancelDownvotePost: function(postId){
      return cancelDownvote.call(this, Posts, postId);
    },

    upvoteComment: function(commentId){
      return upvote.call(this, Comments, commentId);
    },
    downvoteComment: function(commentId){
      return downvote.call(this, Comments, commentId);
    },
    cancelUpvoteComment: function(commentId){
      return cancelUpvote.call(this, Comments, commentId);
    },
    cancelDownvoteComment: function(commentId){
      return cancelDownvote.call(this, Comments, commentId);
    }
  });

})();