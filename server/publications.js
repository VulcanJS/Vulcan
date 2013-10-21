var userFieldsPrivacy = { // false means private
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
  return Meteor.users.find(this.userId);
});

Meteor.publish('singleUser', function(userId) {
  if(isAdminById(this.userId)){
    return Meteor.users.find(userId);
  }else{
    return Meteor.users.find(userId, {fields: userFieldsPrivacy}); 
  }
});

Meteor.publish('allUsers', function() {
  if (isAdminById(this.userId)) {
    // if user is admin, publish all fields
    return Meteor.users.find();
  }else{
    // else, filter out sensitive info
    return Meteor.users.find({}, {fields: userFieldsPrivacy});
  }
});

// Posts

// a single post, identified by id
Meteor.publish('singlePost', function(id) {
  return Posts.find(id);
});

Meteor.publish('paginatedPosts', function(find, options, limit) {
  options = options || {};
  options.limit = limit;
  return Posts.find(find || {}, options);
});

Meteor.publish('postDigest', function(date) {
  var mDate = moment(date);
  return findDigestPosts(mDate);
});

// Other Publications

Meteor.publish('comments', function(query) {
  return Comments.find(query);
});

Meteor.publish('settings', function() {
  return Settings.find();
});

Meteor.publish('notifications', function() {
  // only publish notifications belonging to the current user
  return Notifications.find({userId:this.userId});
});

Meteor.publish('categories', function() {
  return Categories.find();
});