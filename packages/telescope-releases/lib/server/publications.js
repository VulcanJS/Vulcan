Meteor.publish('currentRelease', function() {
  if(isAdminById(this.userId)){
    return Releases.find({}, {sort: {createdAt: -1}, limit: 1});
  }
  return [];
});