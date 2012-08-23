Template.selected_comment.events = {
  'click input[type=submit]': function(){
    var post = Session.get('selected_post');
    var parentComment = Session.get('selected_comment');
    var $comment = $('#comment');
    var comment = {
        post: post._id
      , parent: parentComment._id
      , body: $comment.val()
      , submitter: Meteor.user().username
      , submitted: new Date().getTime()
    };
    Comments.insert(comment);
    Session.set('selected_comment', null);
    Session.set('state', 'view_post');
  }
};

Template.selected_comment.show = function(){
  return Session.equals('state', 'reply');
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
