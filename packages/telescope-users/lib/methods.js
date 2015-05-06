Meteor.methods({
  // not used for now
  changeEmail: function (userId, newEmail) {
    var user = Meteor.users.findOne(userId);
    if (Users.can.edit(Meteor.user(), user) !== true) {
      throw new Meteor.Error("Permission denied");
    }
    Meteor.users.update(
      userId,
      {$set: {
          emails: [{address: newEmail, verified: false}],
          emailHash: Gravatar.hash(newEmail),
          // Just in case this gets called from somewhere other than /client/views/users/user_edit.js
          "profile.email": newEmail
        }
      }
    );
  }
});
