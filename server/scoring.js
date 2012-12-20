// "secret" server code to recalculate scores

var updateScore = function (collection, id) {
  var object = collection.findOne(id);

  // use baseScore if defined, if not just use the number of votes
  // note: for transition period, also use votes if there are more votes than baseScore
  var baseScore = Math.max(object.votes || 0, object.baseScore || 0);

  // now multiply by 'age' exponentiated
  // FIXME: timezones <-- set by server or is getTime() ok?
  var ageInHours = (new Date().getTime() - object.submitted) / (60 * 60 * 1000);

  // HN algorithm (same as Bindle)
  var newScore = baseScore / Math.pow(ageInHours + 2, 1.3);

  collection.update(id, {$set: {score: newScore}});

  // console.log('old score: '+object.baseScore+' | new score: '+newScore+' | score diff: '+Math.abs(newScore-object.baseScore));
};

Meteor.startup(function () {
  var scoreInterval = getSetting("scoreUpdateInterval") || 30;
  // recalculate scores every N seconds
  if(scoreInterval>0){
    intervalId=Meteor.setInterval(function () {
      // console.log('tick ('+scoreInterval+')');
      Posts.find().forEach(function (post) { updateScore(Posts, post._id); });
      Comments.find().forEach(function (comment) { updateScore(Comments, comment._id); });
    }, scoreInterval * 1000);
  }
});
