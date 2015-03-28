// Publish a single post

Meteor.publish('singlePost', function(id) {
  if (can.viewById(this.userId)){
    return Posts.find(id);
  }
  return [];
});

// Publish author of the current post, authors of its comments, and upvoters of the post

Meteor.publish('postUsers', function(postId) {
  if (can.viewById(this.userId)){
    // publish post author and post commenters
    var post = Posts.findOne(postId),
        users = [post.userId]; // publish post author's ID

    if (post) {

      // get IDs from all commenters on the post
      var comments = Comments.find({postId: post._id}).fetch();
      if (comments.length) {
        users = users.concat(_.pluck(comments, "userId"));
      }

      // publish upvoters
      if (post.upvoters && post.upvoters.length) {
        users = users.concat(post.upvoters);
      }

      // publish downvoters
      if (post.downvoters && post.downvoters.length) {
        users = users.concat(post.downvoters);
      }

    }

    // remove any duplicate IDs
    users = _.unique(users);
    
    return Meteor.users.find({_id: {$in: users}}, {fields: privacyOptions});
  }
  return [];
});

// Publish comments for a specific post

Meteor.publish('postComments', function(postId) {
  if (can.viewById(this.userId)){
    return Comments.find({postId: postId}, {sort: {score: -1, postedAt: -1}});
  }
  return [];
});