import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";

Meteor.startup(function () {
  var scoreInterval = parseInt(Telescope.settings.get("scoreUpdateInterval")) || 30;
  if (scoreInterval > 0) {

    // active items get updated every N seconds
    Meteor.setInterval(function () {

      var updatedPosts = 0; // eslint-disable-line
      var updatedComments = 0; // eslint-disable-line
      // console.log('tick ('+scoreInterval+')');
      Posts.find({'status': 2,'inactive': {$ne : true}}).forEach(function (post) { // only run scoring on approved posts
        updatedPosts += Telescope.updateScore({collection: Posts, item: post});
      });
      Comments.find({'inactive': {$ne : true}}).forEach(function (comment) {
        updatedComments += Telescope.updateScore({collection: Comments, item: comment});
      });
      // console.log("Updated "+updatedPosts+"/"+Posts.find().count()+" Posts")
      // console.log("Updated "+updatedComments+"/"+Comments.find().count()+" Comments")
    }, scoreInterval * 1000);

    // inactive items get updated every hour
    Meteor.setInterval(function () {
      var updatedPosts = 0; // eslint-disable-line
      var updatedComments = 0; // eslint-disable-line
      Posts.find({'inactive': true}).forEach(function (post) {
        updatedPosts += Telescope.updateScore({collection: Posts, item: post});
      });
      Comments.find({'inactive': true}).forEach(function (comment) {
        updatedComments += Telescope.updateScore({collection: Comments, item: comment});
      });
    }, 3600 * 1000);

  }
});
