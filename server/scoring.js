
Meteor.startup(function () {
  var scoreInterval = getSetting("scoreUpdateInterval") || 30;
  if (scoreInterval > 0) {

    // active items get updated every N seconds
    intervalId = Meteor.setInterval(function () {
      var updatedPosts = 0;
      var updatedComments = 0;
      // console.log('tick ('+scoreInterval+')');
      Posts.find({'status': 2,'inactive': {$ne : true}}).forEach(function (post) { // only run scoring on approved posts
        updatedPosts += updateScore({collection: Posts, item: post});
      });
      Comments.find({'inactive': {$ne : true}}).forEach(function (comment) {
        updatedComments += updateScore({collection: Comments, item: comment});
      });
      // console.log("Updated "+updatedPosts+"/"+Posts.find().count()+" Posts")
      // console.log("Updated "+updatedComments+"/"+Comments.find().count()+" Comments")
    }, scoreInterval * 1000);

    // inactive items get updated every hour
    inactiveIntervalId = Meteor.setInterval(function () {
      var updatedPosts = 0;
      var updatedComments = 0;
      Posts.find({'inactive': true}).forEach(function (post) {
        updatedPosts += updateScore({collection: Posts, item: post});
      });
      Comments.find({'inactive': true}).forEach(function (comment) {
        updatedComments += updateScore({collection: Comments, item: comment});
      });
    }, 3600 * 1000);

  }
});
