Template.comment_form.rendered = function(){
	if(Meteor.user() && !this.editor){
		this.editor = new EpicEditor(EpicEditorOptions).load();
	}
}

Template.comment_form.events = {
  'click input[type=submit]': function(e, instance){
    e.preventDefault();
	var $comment = $('#comment');
	var content = instance.editor.exportFile();

    if(selectedCommentId=Session.get('selectedCommentId')){
    	// post a child comment
	    var parentCommentId =selectedCommentId;
	    var postId=Comments.findOne(parentCommentId).post;
        var commentId=Meteor.call('comment', postId, parentCommentId, content, function(error, result){
            Session.set('selectedCommentId', null);
            trackEvent("new child comment", {'postId': postId, 'commentId': result, 'parentId': parentCommentId});
            Router.navigate('posts/'+postId, {trigger:true});
        });
       
    }else{
    	// post a root comment
    	var parentCommentId=null;
    	var postId=Session.get('selectedPostId');
        var commentId=Meteor.call('comment', postId, parentCommentId, content, function(error, result){
            trackEvent("new root comment", {'postId': postId, 'commentId': result});
            // window.location.hash=result;
            instance.editor.importFile('editor', '');
        });
    }
  }
};
