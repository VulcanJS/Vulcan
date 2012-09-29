(function() {
  // returns how much "power" a user's votes have
  var getVotePower = function(userId){
    var user = Meteor.users.findOne(userId);
    return (user && user.isAdmin) ? 5 : 1;
  };

  var modifyKarma = function(userId, karma){
    Meteor.users.update({_id: userId}, {$inc: {karma: karma}});
  };

  var hasUpvotedItem= function(userId, collection, id){
    // see http://www.mongodb.org/display/DOCS/MongoDB+Data+Modeling+and+Rails
    // 'is there an item with this id which contains this userId in its upvoters?'
    // if such an item  exists, it means we have voted.
    return collection.findOne({_id: id, upvoters: userId}) !== undefined;
  }

  var hasDownvotedItem= function(userId, collection, id){
    return collection.findOne({_id: id, downvoters: userId}) !== undefined;
  }

  var upvote = function(collection, id) {
    if (!this.userId() || hasUpvotedItem(this.userId(), collection, id))
      return false;

    var votePower=getVotePower(this.userId());
    var votedItem = collection.findOne(id);

    // Votes & Score
    collection.update({_id: id},
                      {$addToSet: {upvoters: this.userId()},
                       $inc: {votes: 1, baseScore: votePower}});
    if(!this.isSimulation)
      updateScore(collection, id);

    // Karma     
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != this.userId()) {
      modifyKarma(votedItem.user_id, votePower);
    }
    
    return true;
  };

  var downvote = function(collection, id) {
    if (!this.userId() || hasDownvotedItem(this.userId(), collection, id))
      return false;

    var votePower=getVotePower(this.userId());
    var votedItem = collection.findOne(id);

    // Votes & Score
    collection.update({_id: id},
                      {$addToSet: {downvoters: this.userId()},
                       $inc: {votes: -1, baseScore: -votePower}});
    if(!this.isSimulation)  
      updateScore(collection, id);

    // Karma
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != this.userId()) {
      modifyKarma(votedItem.user_id, -votePower);
    }

    return true;
  };

  var cancelUpvote = function(collection, id) {
    if (!this.userId() || !hasUpvotedItem(this.userId(), collection, id))
      return false;

    var votePower=getVotePower(this.userId());
    var votedItem = collection.findOne(id);
   
    // Votes & Score
    collection.update({_id: id},
                      {$pull: {upvoters: this.userId()},
                       $inc: {votes: -1, baseScore: -votePower}});
    if(!this.isSimulation)
      updateScore(collection, id);

    // Karma
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != this.userId()) {
      modifyKarma(votedItem.user_id, -votePower);
    }
    
    return true;
  };

  var cancelDownvote = function(collection, id) {
    if (!this.userId() || !hasDownvotedItem(this.userId(), collection, id))
      return false;

    var votePower=getVotePower(this.userId());
    var votedItem = collection.findOne(id);
    
    // Votes & Score
    collection.update({_id: id},
                      {$pull: {downvoters: this.userId()},
                       $inc: {votes: 1, baseScore: votePower}});
    if(!this.isSimulation)
      updateScore(collection, id);

    // Karma
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != this.userId()) {
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