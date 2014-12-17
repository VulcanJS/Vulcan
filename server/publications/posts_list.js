// Publish a list of posts

Meteor.publish('postsList', function(terms) {
  if(canViewById(this.userId)){
    var parameters = getPostsParameters(terms),
        posts = Posts.find(parameters.find, parameters.options);

    // console.log('//-------- Subscription Parameters:');
    // console.log(parameters.find);
    // console.log(parameters.options);
    // console.log('Found '+posts.fetch().length+ ' posts:');
    // posts.rewind();
    // console.log(_.pluck(posts.fetch(), 'title'));
    return posts;
  }
  return [];
});

// Publish all the users that have posted the currently displayed list of posts
// plus the commenters for each post

Meteor.publish('postsListUsers', function(terms) {
  if(canViewById(this.userId)){
    var parameters = getPostsParameters(terms),
        posts = Posts.find(parameters.find, parameters.options),
        postsIds = _.pluck(posts.fetch(), '_id'),
        userIds = _.pluck(posts.fetch(), 'userId');

    // for each post, add first four commenter's userIds to userIds array
    posts.forEach(function (post) {
      userIds = userIds.concat(_.first(post.commenters,4));
    });

    userIds = _.unique(userIds);

    return Meteor.users.find({_id: {$in: userIds}}, {fields: avatarOptions, multi: true});
  }
  return [];
});
