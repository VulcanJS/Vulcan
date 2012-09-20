// TODO: should the baseScore be stored, and updated at vote time?

// This interface should change and become more OO, this'll do for now
var Scoring = {
  // re-run the scoring algorithm on a single object
  updateObject: function(object) {
    if(isNaN(object.score)){
      object.score=0;
    }

    // just count the number of votes for now
    var baseScore = object.votes;

    // now multiply by 'age' exponentiated
    // FIXME: timezones <-- set by server or is getTime() ok?
    var ageInHours = (new Date().getTime() - object.submitted) / (60 * 60 * 1000);
    
    object.score = baseScore * Math.pow(ageInHours + 2, -0.1375);

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