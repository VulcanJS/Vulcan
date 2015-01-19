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
