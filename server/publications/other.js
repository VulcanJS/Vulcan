Meteor.publish('settings', function() {
  var options = {};
  if(!isAdminById(this.userId)){
    options = _.extend(options, {
      fields: {
        mailChimpAPIKey: false,
        mailChimpListId: false
      }
    });
  }
  return Settings.find({}, options);
});

Meteor.publish('notifications', function() {
  // only publish notifications belonging to the current user
  if(canViewById(this.userId)){
    return Notifications.find({userId:this.userId});
  }
  return [];
});

Meteor.publish('invites', function(){
  if(canViewById(this.userId)){
    return Invites.find({invitingUserId:this.userId});
  }
});