Template.comment_edit.helpers({
	comment:function(){
		return Comments.findOne(Session.get('selectedCommentId'));
	}
});

Template.comment_edit.rendered = function(){
	var comment= Comments.findOne(Session.get('selectedCommentId'));

	if(comment && Meteor.user() && !this.editor){
		this.editor = new EpicEditor(EpicEditorOptions).load();
		this.editor.importFile('editor',comment.body);
		$(this.editor.editor).bind('keydown', 'meta+return', function(){
			$(window.editor).closest('form').find('input[type="submit"]').click();
		});
	}
}

Template.comment_edit.events = {
	'click input[type=submit]': function(e, instance){
		e.preventDefault();
		if(!Meteor.user()) throw 'You must be logged in.';

		var selectedCommentId=Session.get('selectedCommentId');
		var selectedPostId=Comments.findOne(selectedCommentId).post;
		var content = cleanUp(instance.editor.exportFile());

		var commentId = Comments.update(selectedCommentId,
		{
				$set: {
					body: content
				}
			}
		);

		trackEvent("edit comment", {'postId': selectedPostId, 'commentId': selectedCommentId});

		Meteor.Router.to("/posts/"+selectedPostId+"/comment/"+selectedCommentId);
	}

	, 'click .delete-link': function(e){
		e.preventDefault();
		if(confirm("Are you sure?")){
			var selectedCommentId=Session.get('selectedCommentId');
			Meteor.call('removeComment', selectedCommentId);
			Meteor.Router.to("/comments/deleted");
		}
	}

};




