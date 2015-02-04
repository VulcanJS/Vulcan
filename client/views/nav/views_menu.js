Template[getTemplate('viewsMenu')].helpers({
  menuItem: function () {
    return getTemplate('menuItem');
  },
  views: function () {
    return viewsMenu;
  },
  friendsUrl: function () {
  	if (!Meteor.user()) {
  		return '';
  	}
    return Router.path('user_friends', {slug: Meteor.user().slug});
  }
});

Template[getTemplate('viewsMenu')].events({
  'click .view-friend-link': function () {
  	if (!Meteor.user()) {
  		Meteor.loginWithFacebook({requestPermissions: ['email', 'public_profile', 'user_friends']}, function(err, result){
        if(err) {
          toastr.error(i18n.t("you_are_not_logged_in"), "error");
        } else {
          toastr.success(i18n.t("you_have_successfully_logged_in"), "success");
          var user = Meteor.user();
          Meteor.call('updateFriendsWonders', user, function (error, result) {
            if (error) {
              throw error;
            }
          });
        }
      });
  	}
  }
});
