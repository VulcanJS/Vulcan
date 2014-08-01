Meteor.methods({

  inviteUser: function(invitation){

    // invite user returns the following hash
    // { newUser : true|false }
    // newUser is true if the person being invited is not on the site yet
    
    // invitation can either contain userId or an email address : 
    // { invitedUserEmail : 'bob@gmail.com' } or { userId : 'hello there' } 

    check(invitation, Match.OneOf(
      { invitedUserEmail : String },
      { userId : String }
    ));

    var user = invitation.invitedUserEmail ?
          Meteor.users.findOne({ emails : { $elemMatch: { address: userEmail } } }) :
          Meteor.users.findOne({ _id : invitation.userId }),
        userEmail = invitation.invitedUserEmail ? invitation.invitedUserEmail :
          getEmail(user),
        currentUser = Meteor.user(),
        currentUserCanInvite = (currentUser.inviteCount > 0 && canInvite(currentUser)),
        currentUserIsAdmin = isAdmin(currentUser);

    // check if the person is already invited
    if(user && (isInvited(user) || isAdmin(user))){
      throw new Meteor.Error(403, "This person is already invited.");
    } else {
      if(currentUserIsAdmin || currentUserCanInvite){

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
        }
      } else {
        throw new Meteor.Error(701, "You can't invite this user, sorry.");
      }
    }

    return {
      newUser : typeof user !== "underfined"
    };
  }
});