Template.posts.show = function(){
  return Session.equals('state', 'list');
};

Template.posts.posts = function(){
  var posts = Posts.find({}, {sort: {headline: 1}});
  return posts;
};

Template.posts.rendered = function(){
  console.log('posts rendered');
};