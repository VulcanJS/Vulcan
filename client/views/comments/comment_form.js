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
        // child comment
        var parentCommentId=Session.get('selectedCommentId');
        var parentComment=Comments.findOne(parentCommentId);
        var parentUser=Meteor.users.findOne(parentComment.userId);
        var postId=Comments.findOne(parentCommentId).post;
        var post=Posts.findOne(postId);
        var postUser=Meteor.users.findOne(post.userId);

        var properties={
            'commentAuthorId': Meteor.user()._id,
            'commentAuthorName': getDisplayName(Meteor.user()),
            'postId': postId,
            'postHeadline': post.headline,
            'parentCommentId': parentCommentId,
            'parentAuthorId': parentComment.userId,
            'parentAuthorName': getDisplayName(parentUser)
        };

        Meteor.call('comment', postId, parentCommentId, content, function(error, result){
            Session.set('selectedCommentId', null);

            properties['commentId']=result;

            trackEvent("newComment", properties);

            addNotification("newReply", properties, parentUser, Meteor.user());
            if(parentAuthorId!=post.userId){
                // if the original poster is different from the author of the parent comment
                // notify them too
                addNotification("newComment", properties, postUser, Meteor.user());
            }

            Session.set('scrollToCommentId', result);
            Router.navigate('posts/'+postId, {trigger:true});
        });
    }else{
        // root comment
        var postId=Session.get('selectedPostId');
        var post=Posts.findOne(postId);
        var postUser=Meteor.users.findOne(post.userId);

        var properties={
            'commentAuthorId': Meteor.user()._id,
            'commentAuthorName': getDisplayName(Meteor.user()),
            'postId': postId,
            'postHeadline': post.headline,
        };

        Meteor.call('comment', postId, parentCommentId, content, function(error, result){

            properties['commentId']=result;

            trackEvent("newComment", properties);
            addNotification("newComment", properties, postUser, Meteor.user());
            Session.set('scrollToCommentId', result);
            instance.editor.importFile('editor', '');
        });
    }


    if(window.template=='comment_page'){
        // post a child comment

    }else{
    	// post a root comment
        
    }
  }
};
