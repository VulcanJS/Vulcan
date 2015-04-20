Meteor.publish('feeds', function() {
  if(Users.isAdminById(this.userId)){
    return Feeds.find();
  }
  return [];
});
