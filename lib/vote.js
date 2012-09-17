Meteor.methods({
  voteForPost: function(postId){
    console.log('voting for ' + postId);
    var userId = this.userId();
    if(!userId) return false;
    
    // atomically update the post's votes
    var query = {_id: postId, voters: {$ne: userId}};
    var update = {$push: {voters: userId}, $inc: {votes: 1}};
    Posts.update(query, update);
    
    if (!this.is_simulation) {
      // now update the post's score
      post = Posts.findOne(postId);
      Scoring.updateObject(post);
      Posts.update(postId, {$set: {score: post.score}});
    }
    
    return true;
  },
  
  // this is like the exact same code as above. Is there a way to refactor?
  voteForComment: function(commentId) {
    console.log('voting for ' + commentId);
    var userId = this.userId();
    if(!userId) return false;
    
    // atomically update the comment's votes
    var query = {_id: commentId, voters: {$ne: userId}};
    var update = {$push: {voters: userId}, $inc: {votes: 1}};
    Comments.update(query, update);
    
    if (!this.is_simulation) {
      // now update the comment's score
      comment = Comments.findOne(commentId);
      Scoring.updateObject(comment);
      Comments.update(commentId, {$set: {score: comment.score}});
    }
    
    return true;
  }
});
