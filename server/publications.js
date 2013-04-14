Meteor.publish('currentUser', function() {
  return Meteor.users.find(this.userId);
});
Meteor.publish('allUsers', function() {
  if (this.userId && isAdminById(this.userId)) {
    // if user is admin, publish all fields
    return Meteor.users.find();
  }else{
    // else, filter out sensitive info
    return Meteor.users.find({}, {fields: {
      secret_id: false,
      isAdmin: false,
      emails: false,
      notifications: false,
      'profile.email': false,
      'services.twitter.accessToken': false,
      'services.twitter.accessTokenSecret': false,
      'services.twitter.id': false,
      'services.password': false
    }});
  }
});

Meteor.startup(function(){
  Meteor.users.allow({
      insert: function(userId, doc){
        return true;
      }
    , update: function(userId, doc, fields, modifier){
        return isAdminById(userId) || (doc._id && doc._id === userId);
      }
    , remove: function(userId, doc){
        return isAdminById(userId) || (doc._id && doc._id === userId);
      }
  });
});

// Posts


// a single post, identified by id
Meteor.publish('singlePost', function(id) {
  return Posts.find(id);
});

Meteor.publish('paginatedPosts', function(find, options, limit) {
  options = options || {};
  options.limit = limit;
  
  // console.log('subscribing to paginated posts', find, options, limit);

  return Posts.find(find || {}, options);
});


Meteor.publish('postDigest', function(date) {
  var mDate = moment(date);
  return findDigestPosts(mDate);
});


Meteor.startup(function(){
  Posts.allow({
      insert: canPostById
    , update: canEditById
    , remove: canEditById
  });
});

// Comments


Meteor.publish('comments', function(query) {
  return Comments.find(query);
});

Meteor.startup(function(){
  Comments.allow({
      insert: canCommentById
    , update: canEditById
    , remove: canEditById
  });
});

// Settings


Meteor.publish('settings', function() {
  return Settings.find();
});

Meteor.startup(function(){
  Settings.allow({
      insert: isAdminById
    , update: isAdminById
    , remove: isAdminById
  });
});


// Notifications


Meteor.publish('notifications', function() {
  // only publish notifications belonging to the current user
  return Notifications.find({userId:this.userId});
});

Meteor.startup(function(){
  Notifications.allow({
      insert: function(userId, doc){
        // new notifications can only be created via a Meteor method
        return false;
      }
    , update: canEditById
    , remove: canEditById
  });
});

// Categories


Meteor.publish('categories', function() {
  return Categories.find();
});

Meteor.startup(function(){
  Categories.allow({
      insert: isAdminById
    , update: isAdminById
    , remove: isAdminById
  });
});