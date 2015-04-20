Meteor.publish('currentRelease', function() {
  if(Users.isAdminById(this.userId)){
    return Releases.find({}, {sort: {createdAt: -1}, limit: 1});
  }
  return [];
});