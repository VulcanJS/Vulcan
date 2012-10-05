Template.comment_page.post = function(){
  var selectedComment = Comments.findOne(Session.get('selectedCommentId'));
  return selectedComment && Posts.findOne(selectedComment.post);
};

Template.comment_page.helpers({
	comment: function(){
		var comment = Comments.findOne(Session.get('selectedCommentId'));
		Template.comment_page.repress_recursion = true;
		return comment;
	},
	canComment: function(){
		return canComment(Meteor.user());
	},
	canView: function(){
		return canView(Meteor.user());
	}
});