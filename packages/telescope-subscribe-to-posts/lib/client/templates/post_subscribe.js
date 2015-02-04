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
      Meteor.loginWithFacebook({requestPermissions: ['email', 'public_profile', 'user_friends']}, function(err, result){
        if(err) {
          toastr.error(i18n.t("you_are_not_logged_in"), "error");
        } else {
          toastr.success(i18n.t("you_have_successfully_logged_in"), "success");
        }
      });
      toastr.info(i18n.t("please_log_in_first"), "info");
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
      Meteor.loginWithFacebook({requestPermissions: ['email', 'public_profile', 'user_friends']}, function(err, result){
        if(err) {
          toastr.error(i18n.t("you_are_not_logged_in"), "error");
        } else {
          toastr.success(i18n.t("you_have_successfully_logged_in"), "success");
        }
      });
      toastr.info(i18n.t("please_log_in_first"), "info");
    }

    Meteor.call('unsubscribePost', post._id, function(error, result) {
      if (result)
        trackEvent("post unsubscribed", {'_id': post._id});
    });
  }
});
