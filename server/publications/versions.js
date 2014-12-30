Meteor.publish('currentVersion', function() {
  if(isAdminById(this.userId)){
    return Versions.find({}, {sort: {createdAt: -1}, limit: 1});
  }
  return [];
});