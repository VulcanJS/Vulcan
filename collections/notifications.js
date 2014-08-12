Notifications = new Meteor.Collection('notifications');

// Notifications = new Meteor.Collection("notifications", {
//   schema: new SimpleSchema({
//     properties: {
//       type: Object
//     },
//     event: {
//       type: String
//     },
//     read: {
//       type: Boolean
//     },
//     createdAt: {
//       type: Date
//     },
//     userId: {
//       type: "???"
//     }
//   })
// });

Notifications.allow({
    insert: function(userId, doc){
      // new notifications can only be created via a Meteor method
      return false;
    }
  , update: canEditById
  , remove: canEditById
});

createNotification = function(event, properties, userToNotify) {
  // 1. Store notification in database
  var notification = {
    timestamp: new Date().getTime(),
    userId: userToNotify._id,
    event: event,
    properties: properties,
    read: false
  };
  var newNotificationId=Notifications.insert(notification);

  // 2. Send notification by email (if on server)
  if(Meteor.isServer && getUserSetting('notifications.replies', false, userToNotify)){
    // put in setTimeout so it doesn't hold up the rest of the method
    Meteor.setTimeout(function () {
      notificationEmail = buildEmailNotification(notification);
      sendEmail(getEmail(userToNotify), notificationEmail.subject, notificationEmail.html);
    }, 1);
  }
};

buildSiteNotification = function (notification) {
  var event = notification.event,
      comment = notification.properties.comment,
      post = notification.properties.post,
      userToNotify = Meteor.users.findOne(notification.userId),
      template,
      html

  var properties = {
    profileUrl: getProfileUrlById(comment.userId),
    author: comment.author,
    postCommentUrl: getPostCommentUrl(post._id, comment._id),
    postTitle: post.title
  }

  switch(event){
    case 'newReply':
      template = 'notification_new_reply';
      break;

    case 'newComment':
      template = 'notification_new_comment';
      break; 

    default:
      break;
  }

  html = Blaze.toHTML(Blaze.With(properties, function(){
    return Template[getTemplate(template)]
  }));

  return html;
};

Meteor.methods({
  markAllNotificationsAsRead: function() {
    Notifications.update(
      {userId: Meteor.userId()},
      {
        $set:{
          read: true
        }
      },
      {multi: true}
    );
  }
});