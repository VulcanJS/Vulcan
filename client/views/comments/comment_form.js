Template.comment_form.rendered = function(){
  if(Meteor.user() && !this.editor){
    this.editor = new EpicEditor(EpicEditorOptions).load();
    $(this.editor.editor).bind('keydown', 'meta+return', function(){
      $(window.editor).closest('form').find('input[type="submit"]').click();
    });
  }
}

Template.comment_form.events = {
  'submit form': function(e, instance){
    e.preventDefault();
    $(e.target).addClass('disabled');
    clearSeenErrors();
    var content = instance.editor.exportFile();
    // note: find a better way to test if this is the comment_reply template…
    if(Router._current.path.search('reply') != -1){
      // child comment
      var parentComment = this.comment;
      console.log(parentComment)
      Meteor.call('comment', parentComment.post, parentComment._id, content, function(error, commentProperties){
        if(error){
          console.log(error);
          throwError(error.reason);
        }else{
          trackEvent("newComment", commentProperties);
          Router.go('/posts/'+parentComment.post+'/comment/'+commentProperties.commentId);
        }
      });
    }else{
      // root comment
      var post = this.post;

      Meteor.call('comment', post._id, null, content, function(error, commentProperties){
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
