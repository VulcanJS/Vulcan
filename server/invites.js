Meteor.methods({
  inviteUser: function (userId) {

    var currentUser = Meteor.user();
    var invitedUser = Meteor.users.findOne(userId);
    var invite = {
      invited: invitedUser._id,
      invitedName: getDisplayName(invitedUser),
      time: new Date()
    };

    // if the current user is logged in, still has available invites and is himself invited (or an admin), and the target user is not invited

    if(currentUser && currentUser.invitesCount > 0 && canInvite(currentUser) && !isInvited(invitedUser)){

      // update invinting user
      Meteor.users.update(Meteor.userId(), {$inc:{invitesCount: -1}});
      Meteor.users.update(Meteor.userId(), {$push:{invites: invite}});

      // update invited user
      Meteor.users.update(userId, {$set: {
        isInvited: true,
        invitedBy: currentUser._id,
        invitedByName: getDisplayName(currentUser)
      }});

      Meteor.call('createNotification', {
        event: 'accountApproved', 
        properties: {}, 
        userToNotify: invitedUser, 
        userDoingAction: currentUser, 
        sendEmail: true
      });

    }else{
      throw new Meteor.Error(701, "You can't invite this user, sorry.");
    }
  }
})