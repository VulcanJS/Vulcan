(function() {
  // returns how much "power" a user's votes have
  var votePower = function(userId){
    var user = Meteor.users.findOne(userId);
    return (user && user.isAdmin) ? 5 : 1;
  };

  var upvote = function(collection, id) {
    if (!this.userId())
      return false;

    // only modify the document if my userId isn't already in upvoters
    collection.update({_id: id, upvoters: {$ne: this.userId()}},
                      {$push: {upvoters: this.userId()},
                       $inc: {votes: 1, baseScore: votePower(this.userId())}});

    if (!this.isSimulation)
      updateScore(collection, id);

    return true;
  };

  var downvote = function(collection, id) {
    if (!this.userId())
      return false;

    // only modify the document if my userId isn't already in downvoters
    collection.update({_id: id, downvoters: {$ne: this.userId()}},
                      {$push: {downvoters: this.userId()},
                       $inc: {votes: -1, baseScore: -votePower(this.userId())}});

    if (!this.isSimulation)
      updateScore(collection, id);

    return true;
  };

  var cancelUpvote = function(collection, id) {
    if (!this.userId())
      return false;

    // only modify the document if i am a recorded voter
    collection.update({_id: id, upvoters: this.userId()},
                      {$pull: {upvoters: this.userId()},
                       $inc: {votes: -1, baseScore: -votePower(this.userId())}});

    if (!this.isSimulation)
      updateScore(collection, id);

    return true;
  };

  var cancelDownvote = function(collection, id) {
    if (!this.userId())
      return false;

    // only modify the document if i am a recorded voter
    collection.update({_id: id, downvoters: this.userId()},
                      {$pull: {downvoters: this.userId()},
                       $inc: {votes: 1, baseScore: votePower(this.userId())}});

    if (!this.isSimulation)
      updateScore(collection, id);

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