
Meteor.startup(function () {
  var scoreInterval = getSetting("scoreUpdateInterval") || 30;
  if(scoreInterval>0){

    // active items get updated every N seconds
    intervalId=Meteor.setInterval(function () {
      var updatedPosts = 0;
      var updatedComments = 0;
      // console.log('tick ('+scoreInterval+')');
      Posts.find({'inactive': {$ne : true}}).forEach(function (post) {
        updatedPosts += updateScore(Posts, post);
      });
      Comments.find({'inactive': {$ne : true}}).forEach(function (comment) {
        updatedComments += updateScore(Comments, comment);
      });
      // console.log("Updated "+updatedPosts+"/"+Posts.find().count()+" Posts")
      // console.log("Updated "+updatedComments+"/"+Comments.find().count()+" Comments")
    }, scoreInterval * 1000);

    // inactive items get updated every hour
    inactiveIntervalId=Meteor.setInterval(function () {
      var updatedPosts = 0;
      var updatedComments = 0;
      Posts.find({'inactive': true}).forEach(function (post) {
        updatedPosts += updateScore(Posts, post);
      });
      Comments.find({'inactive': true}).forEach(function (comment) {
        updatedComments += updateScore(Comments, comment);
      });
    }, 3600 * 1000);

  }
});
