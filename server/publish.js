// Posts

Posts = new Meteor.Collection('posts');

Meteor.publish('posts', function() {
  return Posts.find();
});

Meteor.startup(function(){
  Posts.allow({
      insert: function(){ return true; }  //TODO: change to false
    , update: function(userId, docs, fields, modifier){
        console.log("Document's user: "+docs[0].user_id+" | Current user: "+userId);

        if(docs[0].user_id && docs[0].user_id==userId){
          return true;
        }
        return false;
      }
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
      insert: function(){ return false; }
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
