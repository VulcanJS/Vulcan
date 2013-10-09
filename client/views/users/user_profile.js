Template.user_profile.helpers({
  avatarUrl: function() {
    return getAvatarUrl(this);
  },
  canEditProfile: function() {
    var currentUser = Meteor.user();
    return currentUser && (this._id == currentUser._id || isAdmin(currentUser))
  }
});