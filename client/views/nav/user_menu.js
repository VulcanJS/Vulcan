Template[getTemplate('userMenu')].helpers({
  isLoggedIn: function () {
    return !!Meteor.user();
  },
  name: function () {
    return getDisplayName(Meteor.user());
  },
  profileUrl: function () {
    return Router.routes['user_profile'].path({_idOrSlug: Meteor.user().slug});
  },
  userEditUrl: function () {
    return Router.routes['user_edit'].path(Meteor.user());
  }
});
