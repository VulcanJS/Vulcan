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
  },
  update: can.editById,
  remove: can.editById
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
  var newNotificationId = Notifications.insert(notification);

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
      html;

  var properties = {
    profileUrl: getProfileUrlById(comment.userId),
    author: comment.author,
    postCommentUrl: getPostCommentUrl(post._id, comment._id),
    postTitle: post.title
  };

  switch(event){
    case 'newReply':
      template = 'notificationNewReply';
      break;

    case 'newComment':
      template = 'notificationNewComment';
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

// add new post notification callback on post submit
postAfterSubmitMethodCallbacks.push(function (post) {
  if(Meteor.isServer && !!getSetting('emailNotifications', true)){
    // we don't want emails to hold up the post submission, so we make the whole thing async with setTimeout
    Meteor.setTimeout(function () {
      newPostNotification(post, [post.userId])
    }, 1);
  }
  return post;
});

// add new comment notification callback on comment submit
commentAfterSubmitMethodCallbacks.push(function (comment) {
  if(Meteor.isServer && !!getSetting('emailNotifications', true)){

    var parentCommentId = comment.parentCommentId;
    var user = Meteor.user();
    var post = Posts.findOne(comment.postId);
    var postUser = Meteor.users.findOne(post.userId);

    var notificationProperties = {
      comment: _.pick(comment, '_id', 'userId', 'author', 'body'),
      post: _.pick(post, '_id', 'title', 'url')
    };

    if(parentCommentId){
      // child comment
      var parentComment = Comments.findOne(parentCommentId);
      var parentUser = Meteor.users.findOne(parentComment.userId);

      notificationProperties.parentComment = _.pick(parentComment, '_id', 'userId', 'author');

      // reply notification
      // do not notify users of their own actions (i.e. they're replying to themselves)
      if(parentUser._id != user._id)
        createNotification('newReply', notificationProperties, parentUser);

      // comment notification
      // if the original poster is different from the author of the parent comment, notify them too
      if(postUser._id != user._id && parentComment.userId != post.userId)
        createNotification('newComment', notificationProperties, postUser);

    }else{
      // root comment
      // don't notify users of their own comments
      if(postUser._id != user._id)
        createNotification('newComment', notificationProperties, postUser);
    }
  }

  return comment;
});

var emailNotifications = {
  propertyName: 'emailNotifications',
  propertySchema: {
    type: Boolean,
    optional: true,
    defaultValue: true,
    autoform: {
      group: 'notifications',
      instructions: 'Enable email notifications for new posts and new comments.'
    }
  }
}
addToSettingsSchema.push(emailNotifications);
