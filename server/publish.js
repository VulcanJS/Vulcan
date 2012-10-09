Meteor.publish('users', function() {
  if (this.userId() && isAdminById(this.userId())) {
    return Meteor.users.find();
  }else{
    return Meteor.users.find({}, {fields: {
      secret_id: false,
      isAdmin: false,
      emails: false,
      email_hash: false,
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
        //TODO
        return true;
      }
    , update: function(userId, docs, fields, modifier){
      // console.log("updating");
      // console.log(userId);
      // console.log(docs);
      // console.log('fields: '+fields);
      // console.log(modifier); //uncommenting this crashes everything
      if(isAdminById(userId) || (docs[0]._id && docs[0]._id==userId)){
          return true;
        }
        return false;
      }
    , remove: function(userId, docs){ 
        if(isAdminById(userId) || (docs[0]._id && docs[0]._id==userId)){
          return true;
        }
        return false; 
      }
  });
});

// Posts

Posts = new Meteor.Collection('posts');
// Meteor.publish('posts', function() {
//   return Posts.find({}, {sort: {score: -1}});
// });

Meteor.publish('posts', function(postsView) {
  var collection=Posts.find(postsView.find, {sort: postsView.sort, skip: postsView.skip, limit: postsView.limit});

  // console.log("publishing…");
  // console.log(postsView.find, postsView.sort, postsView.skip, postsView.limit);
  // collectionArray=collection.fetch();
  // console.log('collection.count() '+collection.count());
  // console.log('collection.fetch().length '+collectionArray.length);
  // for(i=0;i<collectionArray.length;i++){
  //   console.log('- '+collectionArray[i].headline);
  // }
  // console.log('\n');

  return collection;
});

// FIXME -- check all docs, not just the first one.
Meteor.startup(function(){
  Posts.allow({
      insert: function(userId, doc){
        if(userId){
          doc.userId = userId;
          return true;
        }
        return false;
      }
    , update: function(userId, docs, fields, modifier){ 
        if(isAdminById(userId) || (docs[0].user_id && docs[0].user_id==userId)){
          return true;
        }
        return false;
      }
    , remove: function(userId, docs){ 
        if(isAdminById(userId) || (docs[0].user_id && docs[0].user_id==userId)){
          return true;
        }
        return false; }
  });
});

// Comments

Comments = new Meteor.Collection('comments');

Meteor.publish('comments', function() {
  return Comments.find();
});

Meteor.startup(function(){
  Comments.allow({
      insert: function(userId, doc){
        if(userId){
          return true;
        }
        return false;
      }
    , update: function(userId, docs, fields, modifier){
        if(isAdminById(userId) || (docs[0].user_id && docs[0].user_id==userId)){
          return true;
        }
        return false;
      }
    , remove: function(userId, docs){ 
        if(isAdminById(userId) || (docs[0].user_id && docs[0].user_id==userId)){
          return true;
        }
        return false;
      }
  });
});

// Settings

Settings = new Meteor.Collection('settings');

Meteor.publish('settings', function() {
  return Settings.find();
});

Meteor.startup(function(){
  Settings.allow({
      insert: function(userId, docs){ return isAdminById(userId); }
    , update: function(userId, docs, fields, modifier){ return isAdminById(userId); }
    , remove: function(userId, docs){ return isAdminById(userId); }
  });
});


// Notifications

Notifications = new Meteor.Collection('notifications');

Meteor.publish('notifications', function() {
  return Notifications.find();
});

Meteor.startup(function(){
  Notifications.allow({
      insert: function(userId, doc){
        if(userId){
          return true;
        }
        return false;
      }
    , update: function(userId, docs, fields, modifier){
        if(isAdminById(userId) || (docs[0].user_id && docs[0].user_id==userId)){
          return true;
        }
        return false;
      }
    , remove: function(userId, docs){ 
        if(isAdminById(userId) || (docs[0].user_id && docs[0].user_id==userId)){
          return true;
        }
        return false;
      }
  });
});