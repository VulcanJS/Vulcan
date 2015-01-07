// Publish a single post

Meteor.publish('singlePost', function(id) {
  if (can.viewById(this.userId)){
    return Posts.find(id);
  }
  return [];
});

// Publish authors of the current post and its comments

Meteor.publish('postUsers', function(postId) {
  if (can.viewById(this.userId)){
    // publish post author and post commenters
    var post = Posts.findOne(postId),
        users = [];

    if (post) {
      var comments = Comments.find({postId: post._id}).fetch();
      // get IDs from all commenters on the post, plus post author's ID
      users = _.pluck(comments, "userId");
      users.push(post.userId);
      users = _.unique(users);
    }

    return Meteor.users.find({_id: {$in: users}}, {fields: privacyOptions});
  }
  return [];
});

// Publish comments for a specific post

Meteor.publish('postComments', function(postId) {
  if (can.viewById(this.userId)){
    return Comments.find({postId: postId});
  }
  return [];
});