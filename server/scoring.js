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
  
  // rerun all the scoring
  updateScores: function() {
    Posts.find().forEach(function(post) {
      Scoring.updateObject(post);
      Posts.update(post._id, {$set: {score: post.score}});
    });
  }
}
