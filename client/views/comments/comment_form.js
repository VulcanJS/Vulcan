Template.comment_form.rendered = function(){
	if(Meteor.user() && !this.editor){
		this.editor = new EpicEditor(EpicEditorOptions).load();
	}
}

Template.comment_form.events = {
  'click input[type=submit]': function(e, instance){
    e.preventDefault();
    $(e.target).addClass('disabled');
	var $comment = $('#comment');
	var content = instance.editor.exportFile();

    if(window.template=='comment_page'){
    	// post a child comment
        var selectedCommentId=Session.get('selectedCommentId')
	    var parentCommentId =selectedCommentId;
        var parentComment=Comments.findOne(parentCommentId);
        var parentUser=Meteor.users.findOne(parentComment.userId);
	    var postId=Comments.findOne(parentCommentId).post;
        var post=Posts.findOne(postId);
        var message=getDisplayName(Meteor.user())+' has replied to your comment on "'+post.headline+'"';
        
        Meteor.call('comment', postId, parentCommentId, content, function(error, result){
            Session.set('selectedCommentId', null);

            trackEvent("newChildComment", {
                'postId': postId,
                'postHeadline': post.headline,
                'commentId': result, 
                'commentAuthorId': Meteor.user()._id,
                'commentAuthorName': getDisplayName(Meteor.user()),
                'parentId': parentCommentId, 
                'parentAuthorId': parentComment.userId,
                'parentAuthorName': getDisplayName(parentUser)
            }, parentUser);

            Session.set('scrollToCommentId', result);
            Router.navigate('posts/'+postId, {trigger:true});
        });
    }else{
    	// post a root comment
    	var parentCommentId=null;
    	var postId=Session.get('selectedPostId');
        var post=Posts.findOne(postId);
        var postUser=Meteor.users.findOne(post.userId);
        Meteor.call('comment', postId, parentCommentId, content, function(error, result){
            trackEvent("newRootComment", {
                'postId': postId, 
                'postHeadline': post.headline,
                'commentId': result,
                'commentAuthorId': Meteor.user()._id,
                'commentAuthorName': getDisplayName(Meteor.user())
            }, postUser);
            Session.set('scrollToCommentId', result);
            instance.editor.importFile('editor', '');
        });
    }
  }
};
