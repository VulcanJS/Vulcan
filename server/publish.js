Posts = new Meteor.Collection('posts');

Meteor.publish('posts', function() {
  return Posts.find();
});
