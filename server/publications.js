var privacyOptions = { // false means private
  secret_id: false,
  isAdmin: false,
  emails: false,
  notifications: false,
  invitesCount: false,
  'profile.email': false,
  'services.twitter.accessToken': false,
  'services.twitter.accessTokenSecret': false,
  'services.twitter.id': false,
  'services.password': false,
  'services.resume': false
};

// -------------------------------------------- Users -------------------------------------------- //

// Publish the current user

Meteor.publish('currentUser', function() {
  var user = Meteor.users.find(this.userId);
  return user;
});

// Publish a single user

Meteor.publish('singleUser', function(userIdOrSlug) {
  if(canViewById(this.userId)){
    var options = isAdminById(this.userId) ? {limit: 1} : {limit: 1, fields: privacyOptions};
    var findById = Meteor.users.find(userIdOrSlug, options);
    var findBySlug = Meteor.users.find({slug: userIdOrSlug}, options)
    // if we find something when treating the argument as an ID, return that; else assume it's a slug
    return findById.count() ? findById : findBySlug;
  }
});

// Publish authors of the current post and its comments

Meteor.publish('postUsers', function(postId) {
  if(canViewById(this.userId)){
    // publish post author and post commenters
    var post = Posts.findOne(postId);
    var comments = Comments.find({post: post._id}).fetch();
    // get IDs from all commenters on the post, plus post author's ID
    var users = _.pluck(comments, "userId");
    users.push(post.userId);
    users = _.unique(users);
    return Meteor.users.find({_id: {$in: users}}, {fields: privacyOptions});
  }
});

// Publish author of the current comment

Meteor.publish('commentUser', function(commentId) {
  if(canViewById(this.userId)){
    var comment = Comments.findOne(commentId);
    return Meteor.users.find({_id: comment.userId}, {fields: privacyOptions});
  }
});

// Publish all the users that have posted the currently displayed list of posts

Meteor.publish('postsListUsers', function(find, options) {
  if(canViewById(this.userId)){
    var posts = Posts.find(find, options);
    var userIds = _.pluck(posts.fetch(), 'userId');
    return Meteor.users.find({_id: {$in: userIds}}, {fields: privacyOptions, multi: true});
  }
});

// Publish all users

Meteor.publish('allUsers', function(find, options) {
  if(canViewById(this.userId)){
    if (!isAdminById(this.userId)) // if user is not admin, filter out sensitive info
      options = _.extend(options, {fields: privacyOptions});
    return Meteor.users.find(find, options);  
  }
});

// publish all users for admins to make autocomplete work
// TODO: find a better way

Meteor.publish('allUsersAdmin', function() {
  if (isAdminById(this.userId)) {
    return Meteor.users.find();
  } else {
    this.stop();
  }
});

// -------------------------------------------- Posts -------------------------------------------- //

// Publish a single post

Meteor.publish('singlePost', function(id) {
  if(canViewById(this.userId)){
    return Posts.find(id);
  }
});

// Publish the post related to the current comment

Meteor.publish('commentPost', function(commentId) {
  if(canViewById(this.userId)){
    var comment = Comments.findOne(commentId);
    return Posts.find(comment.post);
  }
});

// Publish a list of posts

Meteor.publish('postsList', function(find, options) {
  if(canViewById(this.userId)){
    options = options || {};
    var posts = Posts.find(find, options);

    // console.log('//-------- Subscription Parameters:');
    // console.log(find);
    // console.log(options);
    // console.log('Found '+posts.fetch().length+ ' posts:');
    // posts.rewind();
    // console.log(_.pluck(posts.fetch(), 'headline'));
    // posts.rewind();

    return posts;
  }
});



// -------------------------------------------- Comments -------------------------------------------- //

// Publish comments for a specific post

Meteor.publish('postComments', function(postId) {
  if(canViewById(this.userId)){  
    return Comments.find({post: postId});
  }
});

// Publish a single comment

Meteor.publish('singleComment', function(commentId) {
  if(canViewById(this.userId)){
    return Comments.find(commentId);
  }
});

// -------------------------------------------- Other -------------------------------------------- //

Meteor.publish('settings', function() {  
  return Settings.find();
});

Meteor.publish('notifications', function() {
  // only publish notifications belonging to the current user
  if(canViewById(this.userId)){
    return Notifications.find({userId:this.userId});
  }
});

Meteor.publish('categories', function() {
  if(canViewById(this.userId)){
    return Categories.find();
  }
});
