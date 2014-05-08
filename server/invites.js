Meteor.methods({
  inviteUser: function (userId) {
    var currentUser = Meteor.user(),
        invitedUser = Meteor.users.findOne(userId),
        invite = {
          invitedId: userId,
          invitedName: getDisplayName(invitedUser),
          time: new Date()
        },
        currentUserCanInvite = (currentUser.inviteCount > 0 && canInvite(currentUser)),
        currentUserIsAdmin = isAdmin(currentUser);

    // if the current user is logged in, still has available invites and is himself invited (or an admin), and the target user is not invited
    if(currentUser && !isInvited(invitedUser) && (currentUserIsAdmin || currentUserCanInvite)){

      // update invinting user
      Meteor.users.update(Meteor.userId(), {$inc:{inviteCount: -1}, $inc:{invitedCount: 1}, $push:{invites: invite}});

      // update invited user
      var a=Meteor.users.update(userId, {$set: {
        isInvited: true,
        invitedBy: currentUser._id,
        invitedByName: getDisplayName(currentUser)
      }});
      console.log(a);

      createNotification({
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
});