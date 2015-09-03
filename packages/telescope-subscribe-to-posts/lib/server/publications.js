Meteor.publish('userSubscribedPosts', function(terms) {
  var parameters = Posts.parameters.get(terms);
  var posts = Posts.find(parameters.find, parameters.options);
  return posts;
});
