Template.comment_form.rendered = function(){
	if(Meteor.user() && !this.editor){
		this.editor = new EpicEditor(EpicEditorOptions).load();
		$(this.editor.editor).bind('keydown', 'meta+return', function(){
			$(window.editor).closest('form').find('input[type="submit"]').click();
		});
	}
}

Template.comment_form.events = {
  'click input[type=submit]': function(e, instance){
    e.preventDefault();
    $(e.target).addClass('disabled');
    clearSeenErrors();
	var content = instance.editor.exportFile();

    if(Meteor.Router.page()=='comment_reply'){
        // child comment
        var parentCommentId=Session.get('selectedCommentId');
        var postId=Comments.findOne(parentCommentId).post;

        Meteor.call('comment', postId, parentCommentId, content, function(error, commentProperties){
            if(error){
                console.log(error);
                throwError(error.reason);
            }else{
                Session.set('selectedCommentId', null);
                trackEvent("newComment", commentProperties);

                Session.set('scrollToCommentId', commentProperties.commentId);
                Meteor.Router.to('/posts/'+postId);
            }
        });
    }else{
        // root comment
        var parentCommentId=null;        
        var postId=Session.get('selectedPostId');

        Meteor.call('comment', postId, parentCommentId, content, function(error, commentProperties){
            if(error){
                console.log(error);
                throwError(error.reason);
            }else{
                trackEvent("newComment", commentProperties);
                Session.set('scrollToCommentId', commentProperties.commentId);
                instance.editor.importFile('editor', '');
            }
        });
    }
  }
};
