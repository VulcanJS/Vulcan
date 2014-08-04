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
    notificationEmail = buildEmailNotification(notification);
    sendEmail(getEmail(userToNotify), notificationEmail.subject, notificationEmail.html);
  }
};

buildSiteNotification = function (notification) {
  var event = notification.event,
      p = notification.properties,
      userToNotify = Meteor.users.findOne(notification.userId),
      html

  switch(event){
    case 'newReply':
      html = '<p><a href="'+getProfileUrlById(p.commentAuthorId)+'">'+p.commentAuthorName+'</a> has replied to your comment on "<a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+p.postTitle+'</a>"</p>';
      break;

    case 'newComment':
      html = '<p><a href="'+getProfileUrlById(p.commentAuthorId)+'">'+p.commentAuthorName+'</a> left a new comment on your post "<a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+p.postTitle+'</a>"</p>';
      break; 

    default:
      break;
  }

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