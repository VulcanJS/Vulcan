Template.comment_form.helpers({
  canComment: function(){
    return canComment(Meteor.user());
  }
})

Template.comment_form.rendered = function(){
  if(Meteor.user() && !this.editor){
    this.editor = new EpicEditor(EpicEditorOptions).load();
    $(this.editor.editor).bind('keydown', 'meta+return', function(){
      $(window.editor).closest('form').find('input[type="submit"]').click();
    });
  }
}

Template.comment_form.events({
  'submit form': function(e, instance){
    e.preventDefault();
    $(e.target).addClass('disabled');
    clearSeenErrors();
    var content = instance.editor.exportFile();
    if(getCurrentTemplate() == 'comment_reply'){
      // child comment
      var parentComment = this.comment;
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
      var post = postObject;

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
});