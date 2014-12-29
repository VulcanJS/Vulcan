Meteor.publish('feeds', function() {
  if(isAdminById(this.userId)){
    return Feeds.find();
  }
  return [];
});
