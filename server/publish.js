// Posts

Posts = new Meteor.Collection('posts');

Meteor.publish('posts', function() {
  return Posts.find();
});

Meteor.startup(function(){
  Posts.allow({
      insert: function(){ return true; }
    , update: function(userId, post){
        // TODO: allow updates to body by submitter
        // TODO: allow updates to * by admins
        return false;
    }
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
    , update: function(userId, comment){
        // TODO: allow updates to body by submitter
        // TODO: allow updates to * by admins
        return false;
    }
  });
});
