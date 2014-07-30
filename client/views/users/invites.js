Template[getTemplate('invites')].helpers({
  canCurrentUserInvite: function(){
    var currentUser = Meteor.user();
    return currentUser && (currentUser.inviteCount > 0 && canInvite(currentUser));
  },

  invitesLeft: function(){
    var currentUser = Meteor.user();
    return currentUser ? currentUser.inviteCount : 0;
  },

  invitesSchema: function() {
    // expose schema for Invites (used by AutoForm) 
    return InviteSchema;
  }
});