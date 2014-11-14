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

Meteor.publish('postsListUsers', function(terms) {
  if(canViewById(this.userId)){
    var parameters = getPostsParameters(terms),
        posts = Posts.find(parameters.find, parameters.options),
        userIds = _.pluck(posts.fetch(), 'userId');
    return Meteor.users.find({_id: {$in: userIds}}, {fields: privacyOptions, multi: true});
  }
  return [];
});
