var privacyOptions = { // false means private
  secret_id: false,
  isAdmin: false,
  emails: false,
  notifications: false,
  'profile.email': false,
  'services.twitter.accessToken': false,
  'services.twitter.accessTokenSecret': false,
  'services.twitter.id': false,
  'services.password': false,
  'services.resume': false
};

// Users

Meteor.publish('currentUser', function() {
  var user = Meteor.users.find(this.userId);
  return user;
});

Meteor.publish('singleUser', function(userIdOrSlug) {
  if(canViewById(this.userId)){
    var options = isAdminById(this.userId) ? {limit: 1} : {limit: 1, fields: privacyOptions};
    var findById = Meteor.users.find(userIdOrSlug, options);
    var findBySlug = Meteor.users.find({slug: userIdOrSlug}, options)
    // if we find something when treating the argument as an ID, return that; else assume it's a slug
    return findById.count() ? findById : findBySlug;
  }
});

Meteor.publish('postUsers', function(postId) {
  if(canViewById(this.userId)){
    // publish post author and post commenters
    var post = Posts.findOne(postId);
    var comments = Comments.find({post: post._id}).fetch();
    // get IDs from all commenters on the post, plus post author's ID
    var users = _.pluck(comments, "userId");
    users.push(post.userId);
    users = _.unique(users);
    return Meteor.users.find({_id: {$in: users}});
  }
});

Meteor.publish('allUsers', function(limit) {
  console.log(limit)
  if(canViewById(this.userId)){
    if (isAdminById(this.userId)) {
      // if user is admin, publish all fields
      return Meteor.users.find({}, {sort:{createdAt: -1}, limit: limit});
    }else{
      // else, filter out sensitive info
      return Meteor.users.find({}, {sort:{createdAt: -1}, limit: limit, fields: userFieldsPrivacy});
    }
  }
});

// Posts

// a single post, identified by id
Meteor.publish('singlePost', function(id) {
  if(canViewById(this.userId)){
    return Posts.find(id);
  }
});

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

Meteor.publish('paginatedPosts', function(find, options, limit) {
  if(canViewById(this.userId)){
    options = options || {};
    options.limit = limit;
    return Posts.find(find || {}, options);
  }
});

Meteor.publish('postDigest', function(date) {
  if(canViewById(this.userId)){  
    var mDate = moment(date);
    return findDigestPosts(mDate);
  }
});

// Other Publications

Meteor.publish('comments', function(postId) {
  if(canViewById(this.userId)){  
    return Comments.find({post: postId});
  }
});

Meteor.publish('singleComment', function(commentId) {
  if(canViewById(this.userId)){
    return Comments.find(commentId);
  }
});

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