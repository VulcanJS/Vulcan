Template.post_submit.onCreated(function () {
  Telescope.subsManager.subscribe('allUsersAdmin');
});

Template.post_submit.helpers({
  postFields: function () {
    return Posts.simpleSchema().getEditableFields(Meteor.user());
  }
});

AutoForm.hooks({
  submitPostForm: {

    before: {
      method: function(doc) {

        var post = doc;

        this.template.$('button[type=submit]').addClass('loading');
        this.template.$('input, textarea').not(":disabled").addClass("disabled").prop("disabled", true);

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
          Messages.flash(i18n.t('you_must_be_logged_in'), 'error');
          return false;
        }

        // ------------------------------ Callbacks ------------------------------ //

        // run all post submit client callbacks on properties object successively
        post = Telescope.callbacks.run("postSubmitClient", post);

        return post;
      }
    },

    onSuccess: function(operation, post) {
      Events.track("new post", {'postId': post._id});
      var template = this.template;
      Telescope.subsManager.subscribe('singlePost', post._id, function () {
        template.$('button[type=submit]').removeClass('loading');
        FlowRouter.go('postPage', post);
      });
    },

    onError: function(operation, error) {
      this.template.$('button[type=submit]').removeClass('loading');
      this.template.$('.disabled').removeClass("disabled").prop("disabled", false);

      Messages.flash(error.message.split('|')[0], 'error'); // workaround because error.details returns undefined
      Messages.clearSeen();
      // $(e.target).removeClass('disabled');
      if (error.error === "603") {
        var dupePostId = error.reason.split('|')[1];
        FlowRouter.go('postPage', {slug: '_', _id: dupePostId});
      }
    }

  }
});
