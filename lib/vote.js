(function() {
  var prepareVote = function(collection, id, fn) {
    // ensure we are logged in
    var userId = this.userId();
    if(!userId) return false;
    
    // now do the real work
    fn(userId);
    
    // now update scores
    if (!this.is_simulation) {
      // now update the post's score
      var object = collection.findOne(id);
      Scoring.updateObject(object);
      collection.update(id, {$set: {score: object.score}});
    }
    
    return true;
  };
  
  var upvote = function(collection, id) {
    return prepareVote.call(this, collection, id, function(userId) {
      var votePower=getVotesPower(userId);
      var query = {_id: id, upvoters: {$ne: userId}};
      var update = {$push: {upvoters: userId}, $inc: {votes: 1}, $inc: {baseScore: votePower}};
      collection.update(query, update);
    });
  };
  
  var downvote = function(collection, id) {
    return prepareVote.call(this, collection, id, function(userId) {
      var votePower=getVotesPower(userId);
      var query = {_id: id, downvoters: {$ne: userId}};
      var update = {$push: {downvoters: userId}, $inc: {votes: -1}, $inc: {baseScore: -votePower}};
      collection.update(query, update);
    });
  };
  
  var cancelUpvote = function(collection, id) {
    return prepareVote.call(this, collection, id, function(userId) {
      var votePower=getVotesPower(userId);
      var query = {_id: id, upvoters: userId};
      var update = {$pull: {upvoters: userId}, $inc: {votes: -1}, $inc: {baseScore: -votePower}};
      collection.update(query, update);
    });
  };
  
  var cancelDownvote = function(collection, id) {
    return prepareVote.call(this, collection, id, function(userId) {
      var votePower=getVotesPower(userId);
      var query = {_id: id, downvoters: userId};
      var update = {$pull: {downvoters: userId}, $inc: {votes: 1}, $inc: {baseScore: -votePower}};
      collection.update(query, update);
    });
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

