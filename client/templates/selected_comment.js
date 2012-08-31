Template.selected_comment.events = {
  'click input[type=submit]': function(evt){
    evt.preventDefault();

    var post = Session.get('selected_post');
    var parentComment = Session.get('selected_comment');
    var $comment = $('#comment');
    Meteor.call('comment', post, parentComment, $comment.val());

    Session.set('selected_comment', null);
    Session.set('state', 'view_post');
  }
};

Template.selected_comment.show = function(){
  return Session.equals('state', 'reply');
};

Template.selected_comment.show_comment_form = function(){
  return Meteor.user() !== null;
};

Template.selected_comment.post = function(){
  var post = Session.get('selected_post');
  return post;
};

Template.selected_comment.comment = function(){
  var comment = Session.get('selected_comment');
  comment.repress_recursion = true;
  return comment;
};
