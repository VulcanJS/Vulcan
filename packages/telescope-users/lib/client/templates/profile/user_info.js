Template.user_info.helpers({
  canEditProfile: function() {
    var currentUser = Meteor.user();
    return currentUser && (this._id === currentUser._id || Users.is.admin(currentUser));
  },
  createdAtFormatted: function() {
    return this.createdAt;
  },
  canInvite: function() {
    // if the user is logged in, the target user hasn't been invited yet, invites are enabled, and user is not viewing their own profile
    return Meteor.user() && Meteor.user()._id !== this._id && !Users.is.invited(this) && Telescope.utils.invitesEnabled() && Users.can.invite(Meteor.user());
  },
  inviteCount: function() {
    return Meteor.user().telescope.inviteCount;
  },
  getTwitterName: function () {
    return Users.getTwitterName(this);
  },
  getGitHubName: function () {
    return Users.getGitHubName(this);
  }
});

Template.user_info.events({
  'click .invite-link': function(e, instance){
    Meteor.call('inviteUser', instance.data.user._id);
    Messages.flash('Thanks, user has been invited.', "success");
  }
});
