Template[getTemplate('viewsMenu')].helpers({
  menuItem: function () {
    return getTemplate('menuItem');
  },
  views: function () {
    return viewsMenu;
  },
  friendsUrl: function () {
    return Router.path('user_friends', {slug: Meteor.user().slug});
  }
});

Template[getTemplate('viewsMenu')].events({
  'click .view-friend-link': function () {
  	var user = Meteor.user();
    Meteor.call('updateFriendsWonders', user, function (error, result) {
    	if (error) {
    		throw error;
    	}
    });
  }
});
