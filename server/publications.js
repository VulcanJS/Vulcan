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
  
  console.log('subscribing to paginated posts', find, options, limit);

  return Posts.find(find || {}, options);
});


Meteor.publish('postDigest', function(date) {
  var mDate = moment(date);
  return findDigestPosts(mDate);
});

// XXX: we'd like to this but you can't return multiple cursors across the
// same collection. Not sure exactly why this is
//
// discuss this with @glasser. If it's not for performance reasons we
// could wire it up ourselves. Otherwise we are back trying to track
// lots of subscriptions on the client side, which is far from ideal.

// for now, we'll just return the single digest for the day they are looking at

// date is a JS date, dayWindow is a number of days either side.
// Meteor.publish('postDigests', function(date, dayWindow) {
  // var mDate = moment(date);
  // var firstDate = moment(mDate).subtract('days', dayWindow);
  // var lastDate = moment(mDate).add('days', dayWindow);
  
  // set up a sub for each day for the DIGEST_PRELOADING days before and after
  // but we want to be smart about it --  
  // var cursors = [];
  // for (mDate = firstDate; mDate < lastDate; mDate.add('days',1 )) {
  //   cursors.push(findDigestPosts(mDate));
  // }
  // 
  // return cursors;
// });

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