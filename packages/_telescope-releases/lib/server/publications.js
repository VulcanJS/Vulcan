Meteor.publish('currentRelease', function() {
  if(Users.is.adminById(this.userId)){
    return Releases.find({}, {sort: {number: -1}, limit: 1});
  }
  return [];
});
