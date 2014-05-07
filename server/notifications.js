getUnsubscribeLink = function(user){
  return Meteor.absoluteUrl()+'unsubscribe/'+user.email_hash;
};

createNotification = function(options) {
  var event = options.event,
      properties = options.properties,
      userToNotify = options.userToNotify,
      userDoingAction = options.userDoingAction,
      sendEmail = options.sendEmail;
  // console.log('adding new notification for:'+getDisplayName(userToNotify)+', for event:'+event);
  // console.log(userToNotify);
  // console.log(userDoingAction);
  // console.log(properties);
  // console.log(sendEmail);
  var notification = {
    timestamp: new Date().getTime(),
    userId: userToNotify._id,
    event: event,
    properties: properties,
    read: false
  };
  var newNotificationId=Notifications.insert(notification);

  // send the notification if notifications are activated,
  // the notificationsFrequency is set to 1, or if it's undefined (legacy compatibility)
  if(sendEmail){
    // get specific notification content for "email" context
    var contents = getNotificationContents(notification, 'email');     
    sendNotification(contents);
  }
};

Meteor.methods({
  unsubscribeUser : function(hash){
    // TO-DO: currently, if you have somebody's email you can unsubscribe them
    // A user-specific salt should be added to the hashing method to prevent this
    var user = Meteor.users.findOne({email_hash: hash});
    if(user){
      var update = Meteor.users.update(user._id, {
        $set: {
          'profile.notifications.users' : 0,
          'profile.notifications.posts' : 0,
          'profile.notifications.comments' : 0,
          'profile.notifications.replies' : 0
        }
      });
      return true;
    }
    return false;
  },
  newPostNotify : function(properties){
    var currentUser = Meteor.users.findOne(this.userId);
    console.log('newPostNotify');
    // send a notification to every user according to their notifications settings
    Meteor.users.find().forEach(function(user) {
      // don't send users notifications for their own posts
      if(user._id !== currentUser._id && getUserSetting('notifications.posts', false, user)){
        properties.userId = user._id;
        var notification = getNotificationContents(properties, 'email');
        sendNotification(notification, user);
      }
    });
  }
});

sendNotification = function (notification) {
  // console.log('send notification:')
  // console.log(notification)
  sendEmail(notification.to, notification.subject, notification.text, notification.html);
};