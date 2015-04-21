/**
 * Post hooks namespace
 */

Posts.hooks = {

  classCallbacks: [],

  submitClientCallbacks: [],
  submitMethodCallbacks: [],
  afterSubmitMethodCallbacks: [], // runs on server only in a timeout

  editClientCallbacks: [], // loops over modifier object
  editMethodCallbacks: [], // loops over modifier (i.e. "{$set: {foo: bar}}") object
  afterEditMethodCallbacks: [], // loops over modifier object

  approvedCallbacks: []

};


/**
 * Increment the user's post count and upvote the post
 */
Posts.hooks.afterSubmitMethodCallbacks.push(function (post) {
  var userId = post.userId,
      postAuthor = Meteor.users.findOne(userId);

  Meteor.users.update({_id: userId}, {$inc: {postCount: 1}});
  upvoteItem(Posts, post, postAuthor);
  return post;
});
