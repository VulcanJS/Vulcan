getUnsubscribeLink = function(user){
  return Meteor.absoluteUrl()+'unsubscribe/'+user.email_hash;
};

Meteor.methods({
  createNotification: function(options){
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
    var notification= {
      timestamp: new Date().getTime(),
      userId: userToNotify._id,
      event: event,
      properties: properties,
      read: false
    }
    var newNotificationId=Notifications.insert(notification);

    // send the notification if notifications are activated,
    // the notificationsFrequency is set to 1, or if it's undefined (legacy compatibility)
    if(sendEmail){
      Meteor.call('sendNotificationEmail', userToNotify, newNotificationId);
    }
  },
  sendNotificationEmail : function(userToNotify, notificationId){
    // Note: we query the DB instead of simply passing arguments from the client
    // to make sure our email method cannot be used for spam
    var notification = Notifications.findOne(notificationId);
    var n = getNotification(notification.event, notification.properties, 'email');
    var to = getEmail(userToNotify);
    var text = n.text + '\n\n Unsubscribe from all notifications: '+getUnsubscribeLink(userToNotify);
    var html = n.html + '<br/><br/><a href="'+getUnsubscribeLink(userToNotify)+'">Unsubscribe from all notifications</a>';
    sendEmail(to, n.subject, text, html);
  },  
  unsubscribeUser : function(hash){
    // TO-DO: currently, if you have somebody's email you can unsubscribe them
    // A site-specific salt should be added to the hashing method to prevent this
    var user = Meteor.users.findOne({email_hash: hash});
    if(user){
      var update = Meteor.users.update(user._id, {
        $set: {'profile.notificationsFrequency' : 0}
      });
      return true;
    }
    return false;
  },
  notifyUsers : function(notification, currentUser){
    // send a notification to every user according to their notifications settings
    _.each(Meteor.users.find().fetch(), function(user, index, list){
      if(user._id !== currentUser._id && getUserSetting('notifications.posts', false, user)){
        // don't send users notifications for their own posts
        sendEmail(getEmail(user), notification.subject, notification.text, notification.html);
      }
    });
  }
});