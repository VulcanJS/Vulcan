(function() {
  var prepareVote = function(collection, id, karma, fn) {
    // ensure we are logged in
    var userId = this.userId();
    if(!userId) return false;
    
    // now do the real work
    var ack = fn(userId);
    
    // now update scores and karma
    if (!this.is_simulation) {
      // now update the post's score
      var object = collection.findOne(id);
      Scoring.updateObject(object);
      collection.update(id, {$set: {score: object.score}});
      
      // if the vote was valid (`ack`), increase/decrease post author's karma by `karma`:
      if (ack) {
        // User's posts and comments do not impact his/her own karma:
        if (object.user_id !== userId) {
          Meteor.users.update({_id: object.user_id}, {$inc: {karma: karma}});
        }
      }
    }
    
    return true;
  };
  
  var upvote = function(collection, id) {
    return prepareVote.call(this, collection, id, 1, function(userId) {
      var votePower=getVotesPower(userId);
      var query = {_id: id, upvoters: {$ne: userId}};
      var ack   = (collection.findOne(query) !== undefined);
      
      var update = {$push: {upvoters: userId}, $inc: {votes: 1}, $inc: {baseScore: votePower}};
      collection.update(query, update);
      return ack;
    });
  };
  
  var downvote = function(collection, id) {
    return prepareVote.call(this, collection, id, -1, function(userId) {
      var votePower=getVotesPower(userId);
      var query = {_id: id, downvoters: {$ne: userId}};
      var ack   = (collection.findOne(query) !== undefined);
      
      var update = {$push: {downvoters: userId}, $inc: {votes: -1}, $inc: {baseScore: -votePower}};
      collection.update(query, update);
      return ack;
    });
  };
  
  var cancelUpvote = function(collection, id) {
    return prepareVote.call(this, collection, id, -1, function(userId) {
      var votePower=getVotesPower(userId);
      var query = {_id: id, upvoters: userId};
      var ack   = (collection.findOne(query) !== undefined);
      
      var update = {$pull: {upvoters: userId}, $inc: {votes: -1}, $inc: {baseScore: -votePower}};
      collection.update(query, update);
      return ack;
    });
  };
  
  var cancelDownvote = function(collection, id) {
    return prepareVote.call(this, collection, id, 1, function(userId) {
      var votePower=getVotesPower(userId);
      var query = {_id: id, downvoters: userId};
      var ack   = (collection.findOne(query) !== undefined);
      
      var update = {$pull: {downvoters: userId}, $inc: {votes: 1}, $inc: {baseScore: -votePower}};
      collection.update(query, update);
      return ack;
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

