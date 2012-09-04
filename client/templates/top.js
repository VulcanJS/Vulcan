Template.top.show = function(){
  return Session.equals('state', 'list');
};

Template.top.posts = function(){
  var posts = Posts.find({}, {sort: {headline: 1}});
  return posts;
};

Template.top.rendered = function(){
  console.log('posts rendered');
};