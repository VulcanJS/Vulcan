AutoForm.hooks({
  editPostForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {

      var updateObject = updateDoc;
      var submit = this;

      // ------------------------------ Checks ------------------------------ //

      if (!Meteor.user()) {
        flashMessage(i18n.t('you_must_be_logged_in'), "");
        return false;
      }

      // ------------------------------ Callbacks ------------------------------ //

      // run all post edit client callbacks on updateObject object successively
      updateObject = postEditClientCallbacks.reduce(function(result, currentFunction) {
          return currentFunction(result);
      }, updateObject);

      // ------------------------------ Update ------------------------------ //
      Meteor.call('editPost', currentDoc._id, updateObject, function(error, post) {
        if(error){
          submit.done(error);
        }else{
          // note: find a way to do this in onSuccess instead?
          trackEvent("edit post", {'postId': post._id});
          Router.go('post_page', {_id: post._id});
          submit.done();
        }
      });

      return false
    },

    onSuccess: function(operation, result, template) {
      // not used right now because I can't find a way to pass the "post" object to this callback
      // console.log(result)
      // trackEvent("new post", {'postId': post._id});
      // if(post.status === STATUS_PENDING)
      //   throwError('Thanks, your post is awaiting approval.');
      // Router.go('/posts/'+post._id);
    },

    onError: function(operation, error, template) {
      console.log(error)
      flashMessage(error.reason.split('|')[0], "error"); // workaround because error.details returns undefined
      clearSeenMessages();
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

Template[getTemplate('post_edit')].events({
  'click .delete-link': function(e){
    var post = this.post;

    e.preventDefault();
    
    if(confirm("Are you sure?")){
      Router.go("/");
      Meteor.call("deletePostById", post._id, function(error) {
        if (error) {
          console.log(error);
          flashMessage(error.reason, 'error');
        } else {
          flashMessage(i18n.t('your_post_has_been_deleted'), 'success');
        }
      });
    }
  }
});