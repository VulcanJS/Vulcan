Meteor.methods({

  inviteUserByEmail: function(invitation){
    
    var userEmail = invitation.invitedUserEmail,
        user = Meteor.users.findOne({ emails : { $elemMatch: { address: userEmail } } }),
        currentUser = Meteor.user(),
        currentUserCanInvite = (currentUser.inviteCount > 0 && canInvite(currentUser)),
        currentUserIsAdmin = isAdmin(currentUser);

    // check if the person is already invited
    if(user && (isInvited(user) || isAdmin(user))){
      throw new Meteor.Error(403, "This person is already invited.");
    } else {
      if((currentUserIsAdmin || currentUserCanInvite)){

        // create an invite
        // consider invite accepted if the invited person has an account already
        Invites.insert({
          invitingUserId: Meteor.userId(),
          invitedUserEmail: userEmail,
          accepted: typeof user !== "undefined"
        });
        
        // update invinting user
        Meteor.users.update(Meteor.userId(), {$inc:{inviteCount: -1}, $inc:{invitedCount: 1}});

        if(user){
          // update invited user
          Meteor.users.update(user._id, {$set: {
            isInvited: true,
            invitedBy: Meteor.userId(),
            invitedByName: getDisplayName(currentUser)
          }});
          
          createNotification({
            event: 'accountApproved',
            properties: {},
            userToNotify: user,
            userDoingAction: currentUser,
            sendEmail: true
          });
        } else {
          // TODO: figure out what to do with new people
        }
      } else {
        throw new Meteor.Error(701, "You can't invite this user, sorry.");
      }
    }
  },

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