// Users

Meteor.publish('users', function(current_user_id) {
  if(current_user_id && isAdmin(Meteor.users.findOne(current_user_id))){
    return Meteor.users.find();
  }else{
    return Meteor.users.find({}, {fields: {emails: false}});
  }
});

Meteor.startup(function(){
  Meteor.users.allow({
      insert: function(userId, doc){
        //TODO
        return true;
      }
    , update: function(userId, docs, fields, modifier){
      //TODO
      console.log("updating user");
      console.log(docs);
      console.log(fields);
        if(isAdmin(userId) || (docs[0].user_id && docs[0].user_id==userId)){
          return true;
        }
        return false;
      }
    , remove: function(userId, docs){ 
        if(isAdmin(userId) || (docs[0].user_id && docs[0].user_id==userId)){
          return true;
        }
        return false; 
      }
  });
});

// Posts

Posts = new Meteor.Collection('posts');

Meteor.publish('posts', function() {
  return Posts.find({}, {sort: {score: -1}});
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
        if(isAdmin(userId) || (docs[0].user_id && docs[0].user_id==userId)){
          return true;
        }
        return false;
      }
    , remove: function(userId, docs){ 
        if(isAdmin(userId) || (docs[0].user_id && docs[0].user_id==userId)){
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
        if(isAdmin(userId) || (docs[0].user_id && docs[0].user_id==userId)){
          return true;
        }
        return false;
      }
    , remove: function(userId, docs){ 
        if(isAdmin(userId) || (docs[0].user_id && docs[0].user_id==userId)){
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
      insert: function(userId, docs){ return isAdmin(userId); }
    , update: function(userId, docs, fields, modifier){ return isAdmin(userId); }
    , remove: function(userId, docs){ return isAdmin(userId); }
  });
});