Meteor.publish('userSubscribedPosts', function(terms) {
  var parameters = Posts.getSubParams(terms);
  var posts = Posts.find(parameters.find, parameters.options);
  return posts;
});
