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
    var contents = buildEmailNotification(notification);     
    sendNotification(contents);
  }
};

buildEmailNotification = function (notification) {
 var event = notification.event,
      p = notification.properties,
      userToNotify = Meteor.users.findOne(notification.userId),
      n = {}

  n.to = getEmail(userToNotify);

  p.profileUrl = getProfileUrlById(p.commentAuthorId);
  p.postCommentUrl = getPostCommentUrl(p.postId, p.commentId);
  p.unsubscribeLink = getUnsubscribeLink(userToNotify);

  switch(event){
    case 'newReply':
      n.subject = 'Someone replied to your comment on "'+p.postTitle+'"';
      n.template = 'emailNewReply';
      n.text = p.commentAuthorName+' has replied to your comment on "'+p.postTitle+'": '+getPostCommentUrl(p.postId, p.commentId);
      break;

    case 'newComment':
      n.subject = 'A new comment on your post "'+p.postTitle+'"';
      n.template = 'emailNewComment';
      n.text = 'You have a new comment by '+p.commentAuthorName+' on your post "'+p.postTitle+'": '+getPostCommentUrl(p.postId, p.commentId);
      break; 

    default:
      break;
  }

  n.html = Handlebars.templates[getTemplate(n.template)](p);
  // append unsubscribe link to all outgoing notifications
  n.text = n.text + '\n\n Unsubscribe from all notifications: '+getUnsubscribeLink(userToNotify);

  return n;
}

sendNotification = function (notification) {
  // console.log('send notification:')
  // console.log(notification)
  var html = buildEmailTemplate(notification.html)
  sendEmail(notification.to, notification.subject, html, notification.text);
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
  }
});

