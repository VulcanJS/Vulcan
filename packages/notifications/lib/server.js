// only publish notifications belonging to the current user
Meteor.publish('notifications', function() {
  return Notifications.collection.find({userId:this.userId});
});

//You can insert manually but this should save you some work.
Notifications.createNotification = function(userId, params, callback) {
  //TODO (possibility): allow for array of userIds or single userId, if array do multi insert

  if (!Notifications.eventTypes[params.event])
    throw new Error('Notification event type does not exists');

  //TODO: sanity check input

  //When creating a new notification
  // 
  // timestamp - you should timestamp every doc
  // userId - there must be a user to notify
  // event - this is the eventType, consider renaming
  // properties - in database metadata, consider renaming
  // read - default false, consider auto-delete?
  // url - allow of iron:router magic. set read to true if visited (see routeSeenByUser)

  var notification = {
    timestamp: new Date().getTime(),
    userId: userId,
    event: params.event,
    properties: params.properties,
    read: false,
    url: params.url
  };

  //I figured I would make it work like an insert
  //Given that this is really server only, do we really want to try/catch?
  //TODO: remove try/catch unless someone says otherwise
  var error, newNotificationId;
  try { 
    newNotificationId = Notifications.collection.insert(notification);
  } catch (e) {
    error = e;
  } finally {
    //TODO: check if callback is function
    callback(error, newNotificationId);
  }
};
