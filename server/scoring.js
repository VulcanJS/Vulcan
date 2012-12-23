// "secret" server code to recalculate scores

var updateScore = function (collection, id) {
  var object = collection.findOne(id);

  // use baseScore if defined, if not just use the number of votes
  // note: for transition period, also use votes if there are more votes than baseScore
  // var baseScore = Math.max(object.votes || 0, object.baseScore || 0);
  var baseScore = object.baseScore;

  // now multiply by 'age' exponentiated
  // FIXME: timezones <-- set by server or is getTime() ok?
  var ageInHours = (new Date().getTime() - object.submitted) / (60 * 60 * 1000);

  // HN algorithm
  var newScore = baseScore / Math.pow(ageInHours + 2, 1.3);

  // Note: before the first time updateScore runs on a new item, its score will be at 0
  var scoreDiff = Math.abs(object.score - newScore);

  // console.log('updating score | scoreDiff:'+scoreDiff);

  // only update database if difference is larger than a given value to avoid extra work
  if (scoreDiff > 0.00001){
    collection.update(id, {$set: {score: newScore}});
    return 1;
  }
  return 0;
};

Meteor.startup(function () {
  var scoreInterval = getSetting("scoreUpdateInterval") || 30;
  // recalculate scores every N seconds
  if(scoreInterval>0){
    intervalId=Meteor.setInterval(function () {
      var updatedPosts = 0;
      var updatedComments = 0;
      // console.log('tick ('+scoreInterval+')');
      Posts.find().forEach(function (post) {
        updatedPosts += updateScore(Posts, post._id);
      });
      Comments.find().forEach(function (comment) {
        updatedComments += updateScore(Comments, comment._id);
      });
      console.log("Updated "+updatedPosts+"/"+Posts.find().count()+" Posts")
      console.log("Updated "+updatedComments+"/"+Comments.find().count()+" Comments")
    }, scoreInterval * 1000);
  }
});
