Meteor.publish('userSubscribedPosts', function(terms) {
  var parameters = getPostsParameters(terms);
  var posts = Posts.find(parameters.find, parameters.options);
  return posts;
});
