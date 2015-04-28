Template.post_edit.helpers({
  postFields: function () {
    return Posts.simpleSchema().getEditableFields(Meteor.user());
  }
});

AutoForm.hooks({
  editPostForm: {

    before: {
      editPost: function(modifier) {
        var post = doc;

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
          Messages.flash(i18n.t('you_must_be_logged_in'), "");
          return false;
        }

        // ------------------------------ Callbacks ------------------------------ //

        // run all post edit client callbacks on modifier object successively
        post = Telescope.callbacks.run("postEditClient", post);


        return post;
      }
    },

    onSuccess: function(operation, post) {
      Events.track("edit post", {'postId': post._id});
      Router.go('post_page', {_id: post._id});
    },

    onError: function(operation, error) {
      console.log(error)
      Messages.flash(error.reason.split('|')[0], "error"); // workaround because error.details returns undefined
      Messages.clearSeen();
    }

  }
});

// delete link
Template.post_edit.events({
  'click .delete-link': function(e){
    var post = this.post;

    e.preventDefault();

    if(confirm("Are you sure?")){
      Router.go("/");
      Meteor.call("deletePostById", post._id, function(error) {
        if (error) {
          console.log(error);
          Messages.flash(error.reason, 'error');
        } else {
          Messages.flash(i18n.t('your_post_has_been_deleted'), 'success');
        }
      });
    }
  }
});
