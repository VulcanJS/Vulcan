Meteor.methods({
  voteForPost: function(post){
    console.log('voting for ' + post._id);
    var userId = this.userId();
    if(!userId) return false;
    
    // atomically update the post's votes
    var query = {_id: post._id, voters: {$ne: userId}};
    var update = {$push: {voters: userId}, $inc: {votes: 1}};
    Posts.update(query, update);
    
    if (!this.is_simulation) {
      // now update the post's score
      post = Posts.findOne(post._id);
      Scoring.updateObject(post);
      Posts.update(post._id, {$set: {score: post.score}});
    }
    
    return true;
  }
});
