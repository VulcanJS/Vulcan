Template.comment_page.post = function(){
  var selectedComment = Comments.findOne(Session.get('selectedCommentId'));
  return selectedComment && Posts.findOne(selectedComment.post);
};