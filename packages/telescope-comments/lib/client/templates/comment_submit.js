Template.comment_submit.helpers({
  commentFields: function () {
    return Comments.simpleSchema().getEditableFields(Meteor.user());
  },
  reason: function () {
    return !!Meteor.user() ? i18n.t('sorry_you_do_not_have_the_rights_to_comments'): i18n.t('please_log_in_to_comment');
  }
});

AutoForm.hooks({
  submitCommentForm: {

    before: {
      method: function(doc) {

        var comment = doc;

        this.template.$('button[type=submit]').addClass('loading');
        var parent = this.formAttributes.parentContext;

        if (!!parent.comment) { // child comment
          var parentComment = parent.comment;
          comment.parentCommentId = parentComment._id;
          comment.postId = parentComment.postId;

          if(!parentComment.topLevelCommentId) { // root comment
            comment.topLevelCommentId = parentComment._id;
          } else { // nested comment
            comment.topLevelCommentId = parentComment.topLevelCommentId;
          }
        } else { // root comment
          var post = parent;
          comment.postId = post._id;
        }

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
          Messages.flash(i18n.t('you_must_be_logged_in'), 'error');
          return false;
        }

        // ------------------------------ Callbacks ------------------------------ //

        // run all comment submit client callbacks on properties object successively
        comment = Telescope.callbacks.run("commentSubmitClient", comment);

        return comment;
      }
    },

    onSuccess: function(operation, comment) {
      this.template.$('button[type=submit]').removeClass('loading');
      Events.track("new comment", {'commentId': comment._id});
      Router.go('post_page', {_id: comment.postId});
      if (comment.status === Posts.config.STATUS_PENDING) {
        Messages.flash(i18n.t('thanks_your_post_is_awaiting_approval'), 'success');
      }
    },

    onError: function(operation, error) {
      this.template.$('button[type=submit]').removeClass('loading');
      Messages.flash(error.message.split('|')[0], 'error'); // workaround because error.details returns undefined
      Messages.clearSeen();
    }

  }
});

Template.comment_submit.onRendered(function() {
  var self = this;
  this.$("textarea").keydown(function (e) {
    if(((e.metaKey || e.ctrlKey) && e.keyCode == 13) || (e.ctrlKey && e.keyCode == 13)){
      self.$('#submitCommentForm').submit();
    }
  });
});
