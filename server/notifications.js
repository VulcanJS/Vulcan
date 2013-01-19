createNotification = function(event, properties, userToNotify, userDoingAction){
  // console.log('adding new notification for:'+getDisplayName(userToNotify)+', for event:'+event);
  // console.log(userToNotify);
  // console.log(userDoingAction);
  // console.log(properties);
  if(userToNotify._id!=userDoingAction._id){
    // make sure we don't notify people of their own actions
    var notification= {
      timestamp: new Date().getTime(),
      userId: userToNotify._id,
      event: event,
      properties: properties,
      read: false
    }
    var newNotificationId=Notifications.insert(notification);

    if(userToNotify.profile && userToNotify.profile.notificationsFrequency === 1){
      Meteor.call('sendNotificationEmail', getEmail(userToNotify), newNotificationId);
    }
  }
};

Meteor.methods({
  unsubscribeUser : function(hash){
    // TO-DO: currently, if you have somebody's email you can unsubscribe them
    // A site-specific salt should be added to the hashing method to prevent this
    var user = Meteor.users.findOne({email_hash: hash});
    if(user){
      var update=Meteor.users.update(user._id, {
          $set: {'profile.notificationsFrequency' : 0}
        }, function(error){
          if(error){
            throw new Meteor.Error(612, error.reason);
          }else{
            return true;
          }
      });
    }
    return false;
  }
});