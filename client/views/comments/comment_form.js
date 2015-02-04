Template[getTemplate('comment_form')].helpers({
  reason: function () {
    return !!Meteor.user() ? i18n.t('sorry_you_do_not_have_the_rights_to_comments'): i18n.t('please_log_in_to_comment');
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

    // now that the form is latency compensated, we don't actually need to show this
    // $commentForm.prop('disabled', true);
    // $submitButton.addClass('loading');

    $commentForm.val('');

    // context can be either post, or comment property
    var postId = !!this._id ? this._id: this.comment.postId;
    var post = Posts.findOne(postId);

    comment = {
      postId: post._id,
      body: body
    }

    // child comment
    if (getCurrentTemplate() == 'comment_reply') {
      comment.parentCommentId = this.comment._id;
    }

    Meteor.call('submitComment', comment, function(error, newComment){
      // $commentForm.prop('disabled', false);
      // $submitButton.removeClass('loading');
      if(error){
        console.log(error);
        toastr.error(error.reason, "error");
      }else{
        trackEvent("newComment", newComment);
      }
    });

  },
  'click .login-to-vote':function() {
    if(!Meteor.user()){
      Meteor.loginWithFacebook({requestPermissions: ['email', 'public_profile', 'user_friends']}, function(err, result){
        if(err) {
          toastr.error(i18n.t("you_are_not_logged_in"), "error");
        } else {
          toastr.success(i18n.t("you_have_successfully_logged_in"), "success");
        }
      });
    }
  }
});
