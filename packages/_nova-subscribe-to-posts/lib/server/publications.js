Meteor.publish('userSubscribedPosts', function(terms) {

  if (this.userId) {
    terms.currentUserId = this.userId; // add userId to terms
  }

  var parameters = Posts.parameters.get(terms);
  var posts = Posts.find(parameters.find, parameters.options);
  return posts;
});
