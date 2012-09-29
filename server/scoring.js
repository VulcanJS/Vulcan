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
};

Meteor.startup(function () {
  // recalculate scores every 10 seconds
  Meteor.setInterval(function () {
    Posts.find().forEach(function (post) { updateScore(Posts, post._id); });
    Comments.find().forEach(function (comment) { updateScore(Comments, comment._id); });
  }, 4 * 1000);
});
