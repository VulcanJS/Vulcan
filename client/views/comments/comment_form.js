var submitComment = function(instance) {
  var data = instance.data;

  instance.$('form').addClass('disabled');
  Messages.clearSeen();

  var comment = {};
  var $commentForm = instance.$('#comment');
  var $submitButton = instance.$('.btn-submit');
  var body = $commentForm.val();

  // now that the form is latency compensated, we don't actually need to show this
  // $commentForm.prop('disabled', true);
  // $submitButton.addClass('loading');

  // context can be either post, or comment property
  var postId = !!data._id ? data._id: data.comment.postId;
  var post = Posts.findOne(postId);

  comment = {
    postId: post._id,
    body: body
  };

  // child comment
  if (getCurrentTemplate() === 'comment_reply') {
    comment.parentCommentId = data.comment._id;
  }

  Meteor.call('submitComment', comment, function(error, newComment){
    // $commentForm.prop('disabled', false);
    // $submitButton.removeClass('loading');
    if(error){
      console.log(error);
      Messages.flash(error.reason, "error");
    }else{
      trackEvent("newComment", newComment);
      $commentForm.val('');
    }
  });
};

Template.comment_form.onRendered(function() {
  var self = this;
  this.$("#comment").keydown(function (e) {
    if(((e.metaKey || e.ctrlKey) && e.keyCode == 13) || (e.ctrlKey && e.keyCode == 13)){
      submitComment(self);
    }
  });
});

Template.comment_form.helpers({
  reason: function () {
    return !!Meteor.user() ? i18n.t('sorry_you_do_not_have_the_rights_to_comments'): i18n.t('please_log_in_to_comment');
  }
});

Template.comment_form.events({
  'submit form': function(e, instance){
    e.preventDefault();
    submitComment(instance);
  }
});
