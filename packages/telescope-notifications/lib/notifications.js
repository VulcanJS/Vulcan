// add new post notification callback on post submit
postAfterSubmitMethodCallbacks.push(function (post) {

  var adminIds = _.pluck(Meteor.users.find({'isAdmin': true}, {fields: {_id:1}}).fetch(), '_id');
  var notifiedUserIds = _.pluck(Meteor.users.find({'profile.notifications.posts': 1}, {fields: {_id:1}}).fetch(), '_id');

  // remove post author ID from arrays
  var adminIds = _.without(adminIds, post.userId);
  var notifiedUserIds = _.without(notifiedUserIds, post.userId);

  if (post.status === STATUS_PENDING && !!adminIds.length) {
    // if post is pending, only notify admins
    Herald.createNotification(adminIds, {courier: 'newPendingPost', data: post});
  } else if (!!notifiedUserIds.length) {
    // if post is approved, notify everybody
    Herald.createNotification(notifiedUserIds, {courier: 'newPost', data: post});
  }
  return post;

});

// notify users that their pending post has been approved
postApproveCallbacks.push(function (post) {
  Herald.createNotification(post.userId, {courier: 'postApproved', data: post});
  return post;
});

// add new comment notification callback on comment submit
commentAfterSubmitMethodCallbacks.push(function (comment) {
  if(Meteor.isServer && !comment.disableNotifications){

    var post = Posts.findOne(comment.postId),
        notificationData = {
          comment: _.pick(comment, '_id', 'userId', 'author', 'body'),
          post: _.pick(post, '_id', 'userId', 'title', 'url')
        },
        userIdsNotified = [];

    // 1. Notify author of post
    // do not notify author of post if they're the ones posting the comment
    if (comment.userId !== post.userId) {

      Herald.createNotification(post.userId, {courier: 'newComment', data: notificationData});
      userIdsNotified.push(post.userId);

    }

    // 2. Notify author of comment being replied to
    if (!!comment.parentCommentId) {

      var parentComment = Comments.findOne(comment.parentCommentId);

      // do not notify author of parent comment if they're also post author or comment author
      // (someone could be replying to their own comment)
      if (parentComment.userId !== post.userId && parentComment.userId !== comment.userId) {

        // add parent comment to notification data
        notificationData.parentComment = _.pick(parentComment, '_id', 'userId', 'author');

        Herald.createNotification(parentComment.userId, {courier: 'newReply', data: notificationData});
        userIdsNotified.push(parentComment.userId);

      }

    }

    // 3. Notify users subscribed to the thread
    // TODO: ideally this would be injected from the telescope-subscribe-to-posts package
    if (!!post.subscribers) {

      // remove userIds of users that have already been notified
      // and of comment author (they could be replying in a thread they're subscribed to)
      var subscriberIdsToNotify = _.difference(post.subscribers, userIdsNotified, [comment.userId]);
      Herald.createNotification(subscriberIdsToNotify, {courier: 'newCommentSubscribed', data: notificationData});

      userIdsNotified = userIdsNotified.concat(subscriberIdsToNotify);

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
      group: 'notifications_fieldset',
      instructions: 'Enable email notifications for new posts and new comments (requires restart).'
    }
  }
};
Settings.addToSchema(emailNotifications);

// make it possible to disable notifications on a per-comment basis
addToCommentsSchema.push(
  {
    propertyName: 'disableNotifications',
    propertySchema: {
      type: Boolean,
      optional: true,
      autoform: {
        omit: true
      }
    }
  }
);

function setNotificationDefaults (user) {
  // set notifications default preferences
  user.profile.notifications = {
    users: false,
    posts: false,
    comments: true,
    replies: true
  };
  return user;
}
userCreatedCallbacks.push(setNotificationDefaults);
