Template[getTemplate('postUpvote')].helpers({
  upvoted: function(){
    var user = Meteor.user();
    if(!user) return false;
    return _.include(this.upvoters, user._id);
  }
});

Template[getTemplate('postUpvote')].events({
  'click .upvote-link': function(e, instance){
    var post = this;
    e.preventDefault();
    if(!Meteor.user()){
      Meteor.loginWithFacebook({requestPermissions: ['email', 'public_profile', 'user_friends']}, function(err, result){
        if(err) {
          toastr.error(i18n.t("you_are_not_logged_in"), "error");
        } else {
          toastr.success(i18n.t("you_have_successfully_logged_in"), "success");
        }
      });
      toastr.info(i18n.t("please_log_in_first"), "info");
    }
    Meteor.call('upvotePost', post, function(error, result){
      trackEvent("post upvoted", {'_id': post._id});
    });
  }
});
