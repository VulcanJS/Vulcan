Posts = new Meteor.Collection('posts');

Meteor.subscribe('posts');

Template.posts.posts = function(){
  var posts = Posts.find({}, {sort: {headline: 1}});
  return posts;
};
