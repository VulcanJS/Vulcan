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
  		return Meteor.loginWithFacebook({requestPermissions: ['email', 'public_profile', 'user_friends']});
  	}
  	var user = Meteor.user();
    Meteor.call('updateFriendsWonders', user, function (error, result) {
    	if (error) {
    		throw error;
    	}
    });
  }
});
