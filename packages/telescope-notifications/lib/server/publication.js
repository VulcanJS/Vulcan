Meteor.publish('notifications', function() {
  // only publish notifications belonging to the current user
  if(canViewById(this.userId)){
    return Notifications.find({userId:this.userId});
  }
  return [];
});