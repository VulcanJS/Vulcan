Template.post_edit.onCreated(function () {

  var template = this;

  // initialize the reactive variables
  template.ready = new ReactiveVar(false);

  var postSubscription = Telescope.subsManager.subscribe('singlePost', FlowRouter.getParam("_id"));
  
  // Autorun 3: when subscription is ready, update the data helper's terms
  template.autorun(function () {

    var subscriptionsReady = postSubscription.ready(); // ⚡ reactive ⚡

    // if subscriptions are ready, set terms to subscriptionsTerms
    if (subscriptionsReady) {
      template.ready.set(true);
    }
  });

});

Template.post_edit.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  post: function () {
    return Posts.findOne(FlowRouter.getParam("_id"));
  },
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
      FlowRouter.go('postPage', post);
    },

    onError: function(formType, error) {
      console.log(error);
      Messages.flash(error.reason.split('|')[0], "error"); // workaround because error.details returns undefined
      Messages.clearSeen();
    }

  }
});