Template.post_subscribe.helpers({
  canSubscribe: function() {
    // you cannot subscribe to your own posts
    return Meteor.userId() && this.userId !== Meteor.userId();
  },
  subscribed: function() {
    var user = Meteor.user();
    if (!user) return false;

    return _.include(this.subscribers, user._id);
  }
});

Template.post_subscribe.events({
  'click .subscribe-link': function(e, instance) {
    e.preventDefault();
    if (this.userId === Meteor.userId())
      return;

    var post = this;

    if (!Meteor.user()) {
      Router.go('atSignIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }

    Meteor.call('subscribePost', post._id, function(error, result) {
      if (result)
        Events.track("post subscribed", {'_id': post._id});
    });
  },

  'click .unsubscribe-link': function(e, instance) {
    e.preventDefault();
    var post = this;

    if (!Meteor.user()) {
      Router.go('atSignIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }

    Meteor.call('unsubscribePost', post._id, function(error, result) {
      if (result)
        Events.track("post unsubscribed", {'_id': post._id});
    });
  }
});
