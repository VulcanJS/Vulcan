Template.selected_comment.show = function(){
  return Session.equals('state', 'reply');
};

Template.selected_comment.post = function(){
  var post = Session.get('selected_post');
  return post;
};

Template.selected_comment.comment = function(){
  var comment = Session.get('selected_comment');
  return comment;
};
