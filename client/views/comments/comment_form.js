Template[getTemplate('comment_form')].helpers({
  canComment: function(){
    return canComment(Meteor.user());
  }
});

Template[getTemplate('comment_form')].events({
  'submit form': function(e, instance){
    var $commentForm = instance.$('#comment');
    e.preventDefault();
    $(e.target).addClass('disabled');
    clearSeenMessages();
    var content = $commentForm.val();
    if(getCurrentTemplate() == 'comment_reply'){
      // child comment
      var parentComment = this.comment;
      Meteor.call('comment', parentComment.postId, parentComment._id, content, function(error, newComment){
        if(error){
          console.log(error);
          flashMessage(error.reason, "error");
        }else{
          trackEvent("newComment", newComment);
          Router.go('post_page_comment', {
            _id: parentComment.postId,
            commentId: newComment._id
          });
        }
      });
    }else{
      // root comment
      var post = postObject;

      Meteor.call('comment', post._id, null, content, function(error, newComment){
        if(error){
          console.log(error);
          flashMessage(error.reason, "error");
        }else{
          trackEvent("newComment", newComment);
          Session.set('scrollToCommentId', newComment._id);
          $commentForm.val('');
        }
      });
    }
  }
});
