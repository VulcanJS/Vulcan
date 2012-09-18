// Users

Meteor.publish('users', function(current_user_id) {
  console.log(Meteor.users.findOne(current_user_id).emails[0].email);
  if(current_user_id && isAdmin(Meteor.users.findOne(current_user_id))){
    return Meteor.users.find();
  }else{
    return Meteor.users.find({}, {fields: {emails: false}});
  }
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
        console.log(userId);
        if(userId){
          doc.userId = userId;
          return true;
        }
        return false;
      }
    , update: function(userId, docs, fields, modifier){
        console.log("Document's user: "+docs[0].user_id+" | Current user: "+userId);
        if(docs[0].user_id && docs[0].user_id==userId){
          return true;
        }
        return false;
      }
    , remove: function(userId, docs){ 
        if(docs[0].user_id && docs[0].user_id==userId){
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
        console.log(userId);
        if(userId){
          return true;
        }
        return false;
      }
    , update: function(userId, docs, fields, modifier){
        // console.log("Document's user: "+docs[0].user_id+" | Current user: "+userId);
        // if(docs[0].user_id && docs[0].user_id==userId){
        //   return true;
        // }
        // return false;
                // temporarily disabling security
        return true;
      }
    , remove: function(userId, docs){ 
        if(docs[0].user_id && docs[0].user_id==userId){
          return true;
        }
        return false; 
      }
  });
});

// MyVotes

MyVotes = new Meteor.Collection('myvotes');

Meteor.publish('myvotes', function() {
  return MyVotes.find();
});

Meteor.startup(function(){
  MyVotes.allow({
      insert: function(){ return false; }
    , update: function(){ return false; }
    , remove: function(){ return false; }
  });
});


// Settings

Settings = new Meteor.Collection('settings');

Meteor.publish('settings', function() {
  return Settings.find();
});

Meteor.startup(function(){
  Settings.allow({
      insert: function(){ return true; }
    , update: function(){ return true; }
    , remove: function(){ return true; }
  });
});