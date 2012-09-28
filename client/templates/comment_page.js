Template.comment_page.post = function(){
  var selected_comment = Comments.findOne(Session.get('selected_comment_id'));
  return selected_comment && Posts.findOne(selected_comment.post);
};

Template.comment_page.comment = function(){
  var comment = Comments.findOne(Session.get('selected_comment_id'));
  Template.comment_page.repress_recursion = true;
  return comment;
};