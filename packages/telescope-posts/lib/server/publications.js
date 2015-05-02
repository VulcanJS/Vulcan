Posts._ensureIndex({"status": 1, "postedAt": 1});

// Publish a list of posts

Meteor.publish('postsList', function(terms) {
  if(Users.can.viewById(this.userId)){
    var parameters = Posts.getSubParams(terms),
        posts = Posts.find(parameters.find, parameters.options);

    return posts;
  }
  return [];
});

// Publish all the users that have posted the currently displayed list of posts
// plus the commenters for each post

Meteor.publish('postsListUsers', function(terms) {
  if(Users.can.viewById(this.userId)){
    var parameters = Posts.getSubParams(terms),
        posts = Posts.find(parameters.find, parameters.options),
        userIds = _.pluck(posts.fetch(), 'userId');

    // for each post, add first four commenter's userIds to userIds array
    posts.forEach(function (post) {
      userIds = userIds.concat(_.first(post.commenters,4));
    });

    userIds = _.unique(userIds);

    return Meteor.users.find({_id: {$in: userIds}}, {fields: Users.pubsub.avatarProperties, multi: true});
  }
  return [];
});

// Publish a single post

Meteor.publish('singlePost', function(id) {
  if (Users.can.viewById(this.userId)){
    return Posts.find(id);
  }
  return [];
});

// Publish author of the current post, authors of its comments, and upvoters of the post

Meteor.publish('postUsers', function(postId) {
  if (Users.can.viewById(this.userId)){
    // publish post author and post commenters
    var post = Posts.findOne(postId);
    var users = [];

    if (post) {

      users.push(post.userId); // publish post author's ID

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

    return Meteor.users.find({_id: {$in: users}}, {fields: Users.pubsub.publicProperties});
  }
  return [];
});
