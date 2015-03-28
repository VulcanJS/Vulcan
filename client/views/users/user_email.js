Template[getTemplate('user_email')].helpers({
  user: function(){
    return Meteor.user();
  },
  username: function () {
    return getUserName(Meteor.user());
  }
});

Template[getTemplate('user_email')].events({
  'submit form': function(e){
    e.preventDefault();
    if(!Meteor.user())
      Messages.flash(i18n.t('you_must_be_logged_in'), 'error');
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
        Messages.flash(error.reason, "error");
      } else {
        Messages.flash(i18n.t('thanks_for_signing_up'), "success");
        // Meteor.call('addCurrentUserToMailChimpList');
        trackEvent("new sign-up", {'userId': user._id, 'auth':'twitter'});
        Router.go('/');
      }
    });
  }

});
