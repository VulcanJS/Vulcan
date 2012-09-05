Template.post.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();

    var post = Posts.findOne(Session.get('selected_post_id'));
    var $comment = $('#comment');
    Meteor.call('comment', post, null, $comment.val());
    $comment.val('');
  }
};

Template.post.show = function(){
  return Session.equals('state', 'view_post');
};

Template.post.show_comment_form = function(){
  return Meteor.user() !== null;
};

Template.post.post = function(){
  var post = Posts.findOne(Session.get('selected_post_id'));
  return post;
};

Template.post.has_comments = function(){
  var post = Posts.findOne(Session.get('selected_post_id'));
  if(post){
    return Comments.find({post: post._id, parent: null}).count() > 0;
  }
};

Template.post.child_comments = function(){
  var post = Posts.findOne(Session.get('selected_post_id'));
  return Comments.find({post: post._id, parent: null});
};
