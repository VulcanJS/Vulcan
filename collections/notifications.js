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

getNotificationContents = function(notification, context){
  // the same notifications can be displayed in multiple contexts: on-site in the sidebar, sent by email, etc. 
  var event = notification.event,
      p = notification.properties,
      context = typeof context === 'undefined' ? 'sidebar' : context,
      userToNotify = Meteor.users.findOne(notification.userId);

  switch(event){
    case 'newReply':
      var n = {
        subject: 'Someone replied to your comment on "'+p.postTitle+'"',
        text: p.commentAuthorName+' has replied to your comment on "'+p.postTitle+'": '+getPostCommentUrl(p.postId, p.commentId),
        html: '<p><a href="'+getProfileUrlById(p.commentAuthorId)+'">'+p.commentAuthorName+'</a> has replied to your comment on "<a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+p.postTitle+'</a>"</p>'
      };
      if(context == 'email')
        n.html += '<p>'+p.commentExcerpt+'</p><a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">Read more</a>';
      break;

    case 'newComment':
      var n = {
        subject: 'A new comment on your post "'+p.postTitle+'"',
        text: 'You have a new comment by '+p.commentAuthorName+' on your post "'+p.postTitle+'": '+getPostCommentUrl(p.postId, p.commentId),
        html: '<p><a href="'+getProfileUrlById(p.commentAuthorId)+'">'+p.commentAuthorName+'</a> left a new comment on your post "<a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+p.postTitle+'</a>"</p>'
      };
      if(context == 'email')
        n.html += '<p>'+p.commentExcerpt+'</p><a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">Read more</a>';
      break;

    case 'newPost':
      var n = {
        subject: p.postAuthorName+' has created a new post: "'+p.postTitle+'"',
        text: p.postAuthorName+' has created a new post: "'+p.postTitle+'" '+getPostUrl(p.postId),
        html: '<a href="'+getProfileUrlById(p.postAuthorId)+'">'+p.postAuthorName+'</a> has created a new post: "<a href="'+getPostUrl(p.postId)+'" class="action-link">'+p.postTitle+'</a>".'  
      };
      break;

    case 'accountApproved':
      var n = {
        subject: 'Your account has been approved.',
        text: 'Welcome to '+getSetting('title')+'! Your account has just been approved.',
        html: 'Welcome to '+getSetting('title')+'!<br/> Your account has just been approved. <a href="'+Meteor.absoluteUrl()+'">Start posting.</a>'
      };
      break;

    case 'newUser':
      var n = {
        subject: 'New user: '+p.username,
        text: 'A new user account has been created: '+p.profileUrl,
        html: 'A new user account has been created: <a href="'+p.profileUrl+'">'+p.username+'</a>'
      };
      break;

    default:
    break;
  }

  // if context is email, append unsubscribe link to all outgoing notifications
  if(context == 'email'){
    n.to = getEmail(userToNotify);
    n.text = n.text + '\n\n Unsubscribe from all notifications: '+getUnsubscribeLink(userToNotify);
    n.html = n.html + '<br/><br/><a href="'+getUnsubscribeLink(userToNotify)+'">Unsubscribe from all notifications</a>';
  }

  return n;
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