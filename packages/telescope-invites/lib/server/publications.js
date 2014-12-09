Meteor.publish('invites', function (userId) {
  var invites = Invites.find({invitingUserId: userId})
  return (this.userId === userId || isAdmin(Meteor.user())) ? invites : []
});