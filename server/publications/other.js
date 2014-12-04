Meteor.publish('invites', function (userSlug){
  var currentUser = Meteor.users.findOne(this.userId);
  if (currentUser && canView(currentUser) && (
    isAdmin(currentUser) ||
    currentUser.slug === userSlug
  )) {
    var user = Meteor.users.findOne({slug: userSlug});
    return Invites.find({invitingUserId: user._id});
  } else {
    return [];
  }
});