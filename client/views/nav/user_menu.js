Template[getTemplate('userMenu')].helpers({
  isLoggedIn: function () {
    return !!Meteor.user();
  },
  name: function () {
    return getDisplayName(Meteor.user());
  },
  profileUrl: function () {
    return Router.path('user_profile', {_idOrSlug: Meteor.user().slug});
  },
  userEditUrl: function () {
    return Router.path('user_edit', {slug: Meteor.user().slug});
  }
});

Template[getTemplate('userMenu')].events({
  'click #facebook-login-btn': function () {
    Meteor.loginWithFacebook({requestPermissions: ['email', 'public_profile', 'user_friends']}, function(err, result){
      if(err) {
        toastr.error(i18n.t("you_are_not_logged_in"), "error");
      } else {
        toastr.success(i18n.t("you_have_successfully_logged_in"), "success");
      }
    });
  },
  'click .sign-out-link': function () {
    Meteor.logout(function(err, result) {
      if(err) {
        toastr.error(i18n.t("you_are_not_logged_out"), "error");
      } else {
        toastr.success(i18n.t("you_have_successfully_logged_out"), "success");
      }
    });
  }
});