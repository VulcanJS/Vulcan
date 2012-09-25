// TODO: should the baseScore be stored, and updated at vote time?

// This interface should change and become more OO, this'll do for now
var Scoring = {
  // re-run the scoring algorithm on a single object
  updateObject: function(object) {
    if(isNaN(object.score)){
      object.score=0;
    }
    if(typeof object.votes === 'undefined'){
      object.votes=0;
    }
    // use baseScore if defined, if not just use the number of votes
    // note: for transition period, also use votes if there are more votes than baseScore
    var baseScore = (typeof object.baseScore === 'undefined' || object.votes>object.baseScore) ? object.votes : object.baseScore;

    // now multiply by 'age' exponentiated
    // FIXME: timezones <-- set by server or is getTime() ok?
    var ageInHours = (new Date().getTime() - object.submitted) / (60 * 60 * 1000);
    
    // Bindle algorithm
    // object.score = baseScore * Math.pow(ageInHours + 2, -0.1375);

    // HN algorithm (same as Bindle)
    object.score = (baseScore) / Math.pow(ageInHours + 2, 1.3);
  },
  
  // rerun all the scoring -- TODO: should we check to see if the score has 
  // changed before saving?
  updateScores: function() {
    Posts.find().forEach(function(post) {
      Scoring.updateObject(post);
      Posts.update(post._id, {$set: {score: post.score}});
    });
    
    Comments.find().forEach(function(comment) {
      Scoring.updateObject(comment);
      Comments.update(comment._id, {$set: {score: comment.score}});
    });
  }
}

// tick every second
Meteor.Cron = new Cron(1000);
// update scores every 10 seconds
Meteor.Cron.addJob(10, function() {
  Scoring.updateScores();
})