Template.post_edit.helpers({
  postFields: function () {
    return Posts.simpleSchema().getEditableFields(Meteor.user());
  }
});

AutoForm.hooks({
  editPostForm: {

    before: {
      "method-update": function() {
        
        var post = this.currentDoc;
        var modifier = this.updateDoc;

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
          Messages.flash(i18n.t('you_must_be_logged_in'), "");
          return false;
        }

        // ------------------------------ Callbacks ------------------------------ //

        modifier = Telescope.callbacks.run("postEditClient", modifier, post);
        return modifier;
      }
    },

    onSuccess: function(formType, post) {
      Events.track("edit post", {'postId': post._id});
      Router.go('post_page', post);
    },

    onError: function(formType, error) {
      console.log(error);
      Messages.flash(error.reason.split('|')[0], "error"); // workaround because error.details returns undefined
      Messages.clearSeen();
    }

  }
});