InviteSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  invitingUserId: {
    type: String,
    optional: true
  },
  invitedUserEmail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  accepted: {
    type: Boolean,
    optional: true
  }
});

Invites = new Meteor.Collection("invites");
Invites.attachSchema(InviteSchema);

// invites are managed through Meteor method

Invites.deny({
  insert: function(){ return true; },
  update: function(){ return true; },
  remove: function(){ return true; }
});

userProfileEdit.push({
  template: 'userInvites',
  order: 2
});

 function setStartingInvites (user) {
  // give new users a few invites (default to 3)
  user.inviteCount = Settings.get('startInvitesCount', 3);
  return user;
}
userCreatedCallbacks.push(setStartingInvites);

function checkIfInvited (user) {
  // if the new user has been invited
  // set her status accordingly and update invitation info
  if(invitesEnabled() && getEmail(user)){
    var invite = Invites.findOne({ invitedUserEmail : getEmail(user) });
    if(invite){
      var invitedBy = Meteor.users.findOne({ _id : invite.invitingUserId });

      user = _.extend(user, {
        isInvited: true,
        invitedBy: invitedBy._id,
        invitedByName: getDisplayName(invitedBy)
      });

      Invites.update(invite._id, {$set : {
        accepted : true
      }});
    }
  }
  return user;
}
userCreatedCallbacks.push(checkIfInvited);
