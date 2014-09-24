Meteor.publish('notifications', function() {
  // only publish notifications belonging to the current user
  return Notifications.find({userId:this.userId});
});

//This is really server only
createNotification = function(userId, params, callback) {
  //TODO (possibility): allow for array of userIds or single userId, if array do multi insert

  if (!NotificationsHelpers.eventTypes[params.event])
    throw new Error('Notification event type does not exists');

  var notification = {
    timestamp: new Date().getTime(),
    userId: userId,
    event: params.event,
    properties: params.properties,
    read: false
  };
  var error, newNotificationId;
  try {
    newNotificationId = Notifications.insert(notification);
  } catch (e) {
    error = e;
  } finally {
    //TODO: check if callback is function
    callback(error, newNotificationId);
  }
};
