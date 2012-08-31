Template.selected_post.events = {
  'click input[type=submit]': function(evt){
    evt.preventDefault();

    var post = Session.get('selected_post');
    var $comment = $('#comment');
    Meteor.call('comment', post, null, $comment.val());
    $comment.val('');
  }
};

Template.selected_post.show = function(){
  return Session.equals('state', 'view_post');
};

Template.selected_post.show_comment_form = function(){
  return Meteor.user() !== null;
};

Template.selected_post.post = function(){
  var post = Session.get('selected_post');
  return post;
};

Template.selected_post.has_comments = function(){
  var post = Session.get('selected_post');
  return Comments.find({post: post._id, parent: null}).count() > 0;
};

Template.selected_post.child_comments = function(){
  var post = Session.get('selected_post');
  return Comments.find({post: post._id, parent: null});
};
