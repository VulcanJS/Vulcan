Template[getTemplate('comment_form')].helpers({
  canComment: function(){
    return canComment(Meteor.user());
  }
});

Template[getTemplate('comment_form')].events({
  'submit form': function(e, instance){

    e.preventDefault();
    $(e.target).addClass('disabled');
    clearSeenMessages();


    var comment = {};
    var $commentForm = instance.$('#comment');
    var $submitButton = instance.$('.btn-submit');
    var body = $commentForm.val();

    $submitButton.addClass('loading');

    if(getCurrentTemplate() == 'comment_reply'){
    
      var parentComment = this.comment;
    
      // child comment
      
      comment = {
        postId: parentComment.postId, 
        parentCommentId: parentComment._id, 
        body: body
      };

      Meteor.call('submitComment', comment, function(error, newComment){

        $submitButton.removeClass('loading');

        if (error) {

          console.log(error);
          flashMessage(error.reason, "error");
        
        } else {
        
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

      comment = {
        postId: post._id,
        body: body
      }
      
      Meteor.call('submitComment', comment, function(error, newComment){
      
        $commentForm.val('');

        $submitButton.removeClass('loading');

        if(error){
      
          console.log(error);
          flashMessage(error.reason, "error");
      
        }else{
      
          trackEvent("newComment", newComment);
          Session.set('scrollToCommentId', newComment._id);
      
        }
      
      });
    }
  }
});
