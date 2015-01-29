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
