Meteor.publish('feeds.list', function() {
  if(Users.is.adminById(this.userId)){
    return Feeds.find();
  }
  return [];
});
