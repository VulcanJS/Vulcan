Posts = new Meteor.Collection('posts');
Meteor.subscribe('posts');

Comments = new Meteor.Collection('comments');
Meteor.subscribe('comments');

// Nav

Template.nav.events = {
  'click .site-nav a': function(evt){
    evt.preventDefault();
    Session.set('selected_post', null);
  }
};

// Posts

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

// Post

Template.post.ago = function(){
  var submitted = new Date(this.submitted);
  return submitted.toString();
};

// Selected Post

Template.selected_post.events = {
  'click input[type=submit]': function(){
    var post = Session.get('selected_post');
    var $comment = $('#comment');
    var comment = {
        post: post._id
      , body: $comment.val()
      , submitter: Meteor.user().username
      , submitted: new Date().getTime()
    };
    Comments.insert(comment);
    $comment.val('');
  }
};

Template.selected_post.show = function(){
  return !!Session.get('selected_post');
};

Template.selected_post.post = function(){
  var post = Session.get('selected_post');
  return post;
};

// Comments

Template.comments.show = function(){
  var post = Session.get('selected_post');
  var comments = Comments.find({ post: post._id });
  return comments.count() > 0;
};

Template.comments.comments = function(){
  var post = Session.get('selected_post');
  var comments = Comments.find({ post: post._id });
  return comments;
};

// Comment

Template.comment.ago = function(){
  var submitted = new Date(this.submitted);
  return submitted.toString();
};
