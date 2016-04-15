Meteor.publish('feeds', function() {
  if(Users.is.adminById(this.userId)){
    return Feeds.find();
  }
  return [];
});
