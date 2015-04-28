Template.comment_edit.helpers({
  commentFields: function () {
    return Comments.simpleSchema().getEditableFields(Meteor.user());
  }
});

AutoForm.hooks({
  editCommentForm: {

    before: {
      editComment: function(modifier) {
        var comment = doc;

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
          Messages.flash(i18n.t('you_must_be_logged_in'), "");
          return false;
        }

        // ------------------------------ Callbacks ------------------------------ //

        // run all post edit client callbacks on modifier object successively
        comment = Telescope.callbacks.run("postEditClient", comment);

        return comment;
      }
    },

    onSuccess: function(operation, comment) {
      Events.track("edit comment", {'commentId': comment._id});
      Router.go('post_page', {_id: comment.postId});
    },

    onError: function(operation, error) {
      console.log(error)
      Messages.flash(error.reason.split('|')[0], "error"); // workaround because error.details returns undefined
      Messages.clearSeen();
    }

  }
});

// delete link
Template.comment_edit.events({
  'click .delete-link': function(e){
    var comment = this.comment;

    e.preventDefault();

    if(confirm("Are you sure?")){
      Router.go("/");
      Meteor.call("deleteCommentById", comment._id, function(error) {
        if (error) {
          console.log(error);
          Messages.flash(error.reason, 'error');
        } else {
          Messages.flash(i18n.t('your_comment_has_been_deleted'), 'success');
        }
      });
    }
  }
});

Template.comment_edit.onRendered(function() {
  var self = this;
  this.$("#comment").keydown(function (e) {
    if(((e.metaKey || e.ctrlKey) && e.keyCode == 13) || (e.ctrlKey && e.keyCode == 13)){
      // editComment(self);
    }
  });
});