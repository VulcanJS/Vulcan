// Posts

Posts = new Meteor.Collection('posts');

Meteor.publish('posts', function() {
  return Posts.find();
});

Meteor.startup(function(){
  Posts.allow({
      insert: function(){ return true; }
    , update: function(){ return false; }
    , remove: function(){ return false; }
  });
});

// Comments

Comments = new Meteor.Collection('comments');

Meteor.publish('comments', function() {
  return Comments.find();
});

Meteor.startup(function(){
  Comments.allow({
      insert: function(){ return true; }
    , update: function(){ return false; }
    , remove: function(){ return false; }
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
