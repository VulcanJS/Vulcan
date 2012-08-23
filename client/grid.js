Posts = new Meteor.Collection('posts');
Meteor.subscribe('posts');

// Posts

Template.posts.show = function(){
  return !Session.get('selected_post');
};

Template.posts.posts = function(){
  var posts = Posts.find({}, {sort: {headline: 1}});
  return posts;
};

// Post

Template.post.events = {
  'click .discuss-link': function(){
    Session.set('selected_post', this);
  }
};

Template.post.ago = function(){
  var submitted = new Date(this.submitted);
  return submitted.toString();
};

// Selected Post

Template.selected_post.show = function(){
  return !!Session.get('selected_post');
};

Template.selected_post.post = function(){
  var post = Session.get('selected_post');
  console.log(post);
  return post;
};
