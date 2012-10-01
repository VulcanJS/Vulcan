Template.comment_page.post = function(){
  var selectedComment = Comments.findOne(Session.get('selectedCommentId'));
  return selectedComment && Posts.findOne(selectedComment.post);
};

Template.comment_page.comment = function(){
  var comment = Comments.findOne(Session.get('selectedCommentId'));
  Template.comment_page.repress_recursion = true;
  return comment;
};