(function() {
  // returns how much "power" a user's votes have
  var getVotePower = function(userId){
    var user = Meteor.users.findOne(userId);
    return (user && user.isAdmin) ? 5 : 1;
  };

  var modifyKarma = function(userId, karma){
    Meteor.users.update({_id: userId}, {$inc: {karma: karma}});
  };

  var giveKarmaForItem = function(votedItem, karma){
    modifyKarma(votedItem.user_id, karma);
  };

  var hasUpvotedItem= function(userId, collection, id){
    // see http://www.mongodb.org/display/DOCS/MongoDB+Data+Modeling+and+Rails
    // 'is there an item with this id which does not contain the userId in its upvoters?'
    // if such an item  exists, it means we haven't voted yet.
    // if it *doesn't* exist, it means we *have* voted
    return collection.findOne({_id: id, upvoters: {$ne: userId}}) === undefined;
  }

  var hasDownvotedItem= function(userId, collection, id){
    return collection.findOne({_id: id, downvoters: {$ne: userId}}) === undefined;
  }

  var upvote = function(collection, id) {
    if (!this.userId() || hasUpvotedItem(this.userId(), collection, id))
      return false;

    var votePower=getVotePower(this.userId());

    // Votes & Score

    // only modify the document if my userId isn't already in upvoters
    collection.update({_id: id, upvoters: {$ne: this.userId()}},
                      {$push: {upvoters: this.userId()},
                       $inc: {votes: 1, baseScore: votePower}});
    if (!this.isSimulation)
      updateScore(collection, id);

    // Karma
       
    var votedItem = collection.findOne(id);
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != this.userId()) {
      giveKarmaForItem(votedItem, votePower);
    }
    

    return true;
  };

  var downvote = function(collection, id) {
    if (!this.userId() || hasDownvotedItem(this.userId(), collection, id))
      return false;

    var votePower=getVotePower(this.userId());
    
    // Votes & Score

    // only modify the document if my userId isn't already in downvoters
    collection.update({_id: id, downvoters: {$ne: this.userId()}},
                      {$push: {downvoters: this.userId()},
                       $inc: {votes: -1, baseScore: -votePower}});
    if (!this.isSimulation)
      updateScore(collection, id);

    // Karma

    var votedItem = collection.findOne(id);
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != this.userId()) {
      giveKarmaForItem(votedItem, -votePower);
    }

    return true;
  };

  var cancelUpvote = function(collection, id) {
    if (!this.userId() || !hasUpvotedItem(this.userId(), collection, id))
      return false;

    var votePower=getVotePower(this.userId());
    
    // Votes & Score

    // only modify the document if i am a recorded voter
    collection.update({_id: id, upvoters: this.userId()},
                      {$pull: {upvoters: this.userId()},
                       $inc: {votes: -1, baseScore: -votePower}});
    if (!this.isSimulation)
      updateScore(collection, id);

    // Karma

    var votedItem = collection.findOne(id);
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != this.userId()) {
      giveKarmaForItem(votedItem, -votePower);
    }
    
    return true;
  };

  var cancelDownvote = function(collection, id) {
    if (!this.userId() || !hasDownvotedItem(this.userId(), collection, id))
      return false;

    var votePower=getVotePower(this.userId());
    
    // Votes & Score

    // only modify the document if i am a recorded voter
    collection.update({_id: id, downvoters: this.userId()},
                      {$pull: {downvoters: this.userId()},
                       $inc: {votes: 1, baseScore: votePower}});
    if (!this.isSimulation)
      updateScore(collection, id);

    // Karma

    var votedItem = collection.findOne(id);
    // user's posts and comments do not impact his own karma:
    if (votedItem.user_id != this.userId()) {
      giveKarmaForItem(votedItem, votePower);
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