Template[getTemplate('postSubscribe')].helpers({
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

Template[getTemplate('postSubscribe')].events({
  'click .subscribe-link': function(e, instance) {
    e.preventDefault();
    if (this.userId === Meteor.userId())
      return;

    var post = this;

    if (!Meteor.user()) {
      Router.go('atSignIn');
      flashMessage(i18n.t("please_log_in_first"), "info");
    }

    Meteor.call('subscribePost', post._id, function(error, result) {
      if (result)
        trackEvent("post subscribed", {'_id': post._id});
    });
  },

  'click .unsubscribe-link': function(e, instance) {
    e.preventDefault();
    var post = this;

    if (!Meteor.user()) {
      Router.go('atSignIn');
      flashMessage(i18n.t("please_log_in_first"), "info");
    }

    Meteor.call('unsubscribePost', post._id, function(error, result) {
      if (result)
        trackEvent("post unsubscribed", {'_id': post._id});
    });
  }
});
