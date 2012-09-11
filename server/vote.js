// TODO: should the baseScore be stored, and updated at vote time?

// This interface should change and become more OO, this'll do for now
var Scoring = {
  // re-run the scoring algorithm on a single object
  updateObject: function(object) {
    
    // just count the number of votes for now
    var baseScore = MyVotes.find({votedFor: object._id}).count();
    
    // now multiply by 'age' exponentiated
    // FIXME: timezones <-- set by server or is getTime() ok?
    var ageInHours = (new Date().getTime() - object.submitted) / (60 * 60 * 1000);
    
    object.score = baseScore * Math.pow(ageInHours + 2, -0.1375);
  },
  
  // rerun all the scoring
  updateScores: function() {
    Posts.find().forEach(function(post) {
      Scoring.updateObject(post);
      Posts.update(post._id, {$set: {score: post.score}});
    });
  }
}




Meteor.methods({
  voteForPost: function(post){
    var user = this.userId();
    if(!user) return false;

    var myvote = MyVotes.findOne({votedFor: post._id, user: user});
    if(myvote) return false;

    MyVotes.insert({votedFor: post._id, user: user, vote: 1});
    
    Scoring.updateObject(post);
    Posts.update(post._id, {$set: {score: post.score}});
    
    return true;
  }
});
