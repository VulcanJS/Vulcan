// accept either an ID or a slug
Meteor.publish('singleUser', function(idOrSlug) {
  var findById = Meteor.users.findOne(idOrSlug);
  var findBySlug = Meteor.users.findOne({slug: idOrSlug});
  var user = typeof findById !== 'undefined' ? findById : findBySlug;
  var options = isAdminById(this.userId) ? {} : {fields: privacyOptions};
  if (user) {
    return Meteor.users.find({_id: user._id}, options);
  }
  return [];
});

Meteor.publish('userPosts', function(terms) {
  var parameters = getPostsParameters(terms);
  var posts = Posts.find(parameters.find, parameters.options);
  return posts;
});

Meteor.publish('userUpvotedPosts', function(terms) {
  var parameters = getPostsParameters(terms);
  var posts = Posts.find(parameters.find, parameters.options);
  return posts;
});

Meteor.publish('userDownvotedPosts', function(terms) {
  var parameters = getPostsParameters(terms);
  var posts = Posts.find(parameters.find, parameters.options);
  return posts;
});

Meteor.publish('userComments', function(userId, limit) {
  var comments = Comments.find({userId: userId}, {limit: limit});
  // if there are comments, find out which posts were commented on
  var commentedPostIds = comments.count() ? _.pluck(comments.fetch(), 'postId') : [];
  return [
    comments,
    Posts.find({_id: {$in: commentedPostIds}})
  ]
});
