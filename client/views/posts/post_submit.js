AutoForm.hooks({
  submitPostForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {

      var properties = insertDoc;
      var submit = this;

      // ------------------------------ Checks ------------------------------ //

      if (!Meteor.user()) {
        flashMessage(i18n.t('you_must_be_logged_in'), 'error');
        return false;
      }

      // ------------------------------ Callbacks ------------------------------ //

      // run all post submit client callbacks on properties object successively
      properties = postSubmitClientCallbacks.reduce(function(result, currentFunction) {
          return currentFunction(result);
      }, properties);

      // console.log(properties)

      // ------------------------------ Insert ------------------------------ //
      Meteor.call('submitPost', properties, function(error, post) {
        if(error){
          submit.done(error);
        }else{
          // note: find a way to do this in onSuccess instead?
          trackEvent("new post", {'postId': post._id});
          if (post.status === STATUS_PENDING) {
            flashMessage(i18n.t('thanks_your_post_is_awaiting_approval'), 'success');
          }
          Router.go('post_page', {_id: post._id});
          submit.done();
        }
      });

      return false
    },

    onSuccess: function(operation, result, template) {
      // not used right now because I can't find a way to pass the "post" object to this callback
      // console.log(post)
      // trackEvent("new post", {'postId': post._id});
      // if(post.status === STATUS_PENDING)
      //   throwError('Thanks, your post is awaiting approval.');
      // Router.go('/posts/'+post._id);
    },

    onError: function(operation, error, template) {
      flashMessage(error.message.split('|')[0], 'error'); // workaround because error.details returns undefined
      clearSeenMessages();
      // $(e.target).removeClass('disabled');
      if (error.error == 603) {
        var dupePostId = error.reason.split('|')[1];
        Router.go('/posts/'+dupePostId);
      }
    }

    // Called at the beginning and end of submission, respectively.
    // This is the place to disable/enable buttons or the form,
    // show/hide a "Please wait" message, etc. If these hooks are
    // not defined, then by default the submit button is disabled
    // during submission.
    // beginSubmit: function(formId, template) {},
    // endSubmit: function(formId, template) {}
  }
});