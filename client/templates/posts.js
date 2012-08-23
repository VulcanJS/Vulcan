Template.posts.show = function(){
  return Session.equals('state', 'list');
};

Template.posts.posts = function(){
  var posts = Posts.find({}, {sort: {headline: 1}});
  return posts;
};
