Template.comment_reply.post = function(){
  var selectedComment = Comments.findOne(Session.get('selectedCommentId'));
  return selectedComment && Posts.findOne(selectedComment.post);
};

Template.comment_reply.helpers({
	comment: function(){
		var comment = Comments.findOne(Session.get('selectedCommentId'));
		Template.comment_page.repress_recursion = true;
		return comment;
	}
});