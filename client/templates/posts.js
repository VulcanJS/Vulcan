Template.posts.events = {
  'click .discuss-link': function(){
    Session.set('selected_post', this);
  }
};

Template.posts.show = function(){
  return !Session.get('selected_post');
};

Template.posts.posts = function(){
  var posts = Posts.find({}, {sort: {headline: 1}});
  return posts;
};
