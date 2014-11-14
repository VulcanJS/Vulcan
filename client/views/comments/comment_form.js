Template[getTemplate('comment_form')].helpers({
  canComment: function(){
    return canComment(Meteor.user());
  }
});

Template[getTemplate('comment_form')].rendered = function(){
  if(Meteor.user() && !this.editor){
    this.editor = new EpicEditor(EpicEditorOptions).load();
    $(this.editor.editor).bind('keydown', 'meta+return', function(){
      $(window.editor).closest('form').find('input[type="submit"]').click();
    });
  }
};

Template[getTemplate('comment_form')].events({
  'submit form': function(e, instance){
    e.preventDefault();
    $(e.target).addClass('disabled');
    clearSeenErrors();
    var content = instance.editor.exportFile();
    if(getCurrentTemplate() == 'comment_reply'){
      // child comment
      var parentComment = this.comment;
      Meteor.call('comment', parentComment.postId, parentComment._id, content, function(error, newComment){
        if(error){
          console.log(error);
          throwError(error.reason);
        }else{
          trackEvent("newComment", newComment);
          Router.go('/posts/'+parentComment.postId+'/comment/'+newComment._id);
        }
      });
    }else{
      // root comment
      var post = postObject;

      Meteor.call('comment', post._id, null, content, function(error, newComment){
        if(error){
          console.log(error);
          throwError(error.reason);
        }else{
          trackEvent("newComment", newComment);
          Session.set('scrollToCommentId', newComment._id);
          instance.editor.importFile('editor', '');
        }
      });
    }
  }
});