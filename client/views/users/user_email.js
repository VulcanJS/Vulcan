Template[getTemplate('user_email')].helpers({
  user: function(){
    return Meteor.user();
  },
  username: function () {
    return getUserName(Meteor.user());
  },
  facebookEmail: function () {
    var user = Meteor.user();
    if (typeof user.services === "undefined" || typeof user.services.facebook === "undefined") {
      return "";
    }
    return user.services.facebook.email;
  }
});

Template[getTemplate('user_email')].events({
  'submit form': function(e){
    e.preventDefault();
    if(!Meteor.user())
      toastr.error(i18n.t('you_must_be_logged_in'), 'error');
    var $target=$(e.target);
    var user=Session.get('selectedUserId')? Meteor.users.findOne(Session.get('selectedUserId')) : Meteor.user();
    var update = {
      "profile.email": $target.find('[name=email]').val(),
      "username": $target.find('[name=username]').val(),
        "slug": slugify($target.find('[name=username]').val())
    };

    // TODO: enable change email
    var email = $target.find('[name=email]').val();
    
    Meteor.users.update(user._id, {
      $set: update
    }, function(error){
      if(error){
        toastr.error(error.reason, "error");
      } else {
        toastr.success(i18n.t('thanks_for_signing_up'), "success");
        // Meteor.call('addCurrentUserToMailChimpList');
        trackEvent("new sign-up", {'userId': user._id, 'auth':'twitter'});
        Router.go('/');
      }
    });
  }

});
