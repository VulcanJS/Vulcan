// only publish notifications belonging to the current user
Meteor.publish('notifications', function() {
  return Notifications.collection.find({userId:this.userId, onsite: true});
});

//You can insert manually but this should save you some work.
Notifications.createNotification = function(userIds, params, callback) {
  

  check(userIds, Match.OneOf([String], String)); //TODO: better Collection ID check
  check(params, Object);
  if (!Notifications.eventTypes[params.event])
    throw new Error('Notification: event type does not exists');

  // always assume multiple users.
  if (_.isString(userIds)) 
    userIds = [userIds]

  users = Meteor.users.find({_id: {$in: userIds}}, {fields: {notifications: 1}})

  users.forEach(function (user) {
    userId = user._id

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

    if (_.contains(Notifications.eventTypes[params.event].media, 'onsite'))
      if (!Notifications.settings.overrides.onsite)
        notification.onsite = true


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
  });
};
