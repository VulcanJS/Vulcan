// add new post notification callback on post submit
function postSubmitNotification (post) {

  var adminIds = _.pluck(Users.find({'isAdmin': true}, {fields: {_id:1}}).fetch(), '_id');
  var notifiedUserIds = _.pluck(Users.find({'telescope.notifications.posts': true}, {fields: {_id:1}}).fetch(), '_id');

  // remove post author ID from arrays
  adminIds = _.without(adminIds, post.userId);
  notifiedUserIds = _.without(notifiedUserIds, post.userId);

  if (post.status === Posts.config.STATUS_PENDING && !!adminIds.length) {
    // if post is pending, only notify admins
    Herald.createNotification(adminIds, {courier: 'newPendingPost', data: post});
  } else if (!!notifiedUserIds.length) {
    // if post is approved, notify everybody
    Herald.createNotification(notifiedUserIds, {courier: 'newPost', data: post});
  }
  return post;

}
Telescope.callbacks.add("postSubmitAsync", postSubmitNotification);

function postApprovedNotification (post) {
  Herald.createNotification(post.userId, {courier: 'postApproved', data: post});
  return post;
}
Telescope.callbacks.add("postApprovedAsync", postApprovedNotification);

// add new comment notification callback on comment submit
function addCommentNotification (comment) {

  if(Meteor.isServer && !comment.disableNotifications){

    var post = Posts.findOne(comment.postId),
        notificationData = {
          comment: _.pick(comment, '_id', 'userId', 'author', 'body'),
          post: _.pick(post, '_id', 'userId', 'title', 'url')
        },
        postAuthor = Users.findOne(post.userId),
        userIdsNotified = [];

    // 1. Notify author of post (if they have new comment notifications turned on)
    //    but do not notify author of post if they're the ones posting the comment
    if (Users.getSetting(postAuthor, "notifications.comments", true) && comment.userId !== postAuthor._id) {
      Herald.createNotification(post.userId, {courier: 'newComment', data: notificationData});
      userIdsNotified.push(post.userId);
    }

    // 2. Notify author of comment being replied to
    if (!!comment.parentCommentId) {

      var parentComment = Comments.findOne(comment.parentCommentId);

      // do not notify author of parent comment if they're also post author or comment author
      // (someone could be replying to their own comment)
      if (parentComment.userId !== post.userId && parentComment.userId !== comment.userId) {

        var parentCommentAuthor = Users.findOne(parentComment.userId);

        // do not notify parent comment author if they have reply notifications turned off
        if (Users.getSetting(parentCommentAuthor, "notifications.replies", true)) {

          // add parent comment to notification data
          notificationData.parentComment = _.pick(parentComment, '_id', 'userId', 'author');

          Herald.createNotification(parentComment.userId, {courier: 'newReply', data: notificationData});
          userIdsNotified.push(parentComment.userId);
        }
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

}

Telescope.callbacks.add("commentSubmitAsync", addCommentNotification);

var emailNotifications = {
  fieldName: 'emailNotifications',
  fieldSchema: {
    type: Boolean,
    optional: true,
    defaultValue: true,
    autoform: {
      group: 'notifications',
      instructions: 'Enable email notifications for new posts and new comments (requires restart).'
    }
  }
};
Settings.addField(emailNotifications);

// make it possible to disable notifications on a per-comment basis
Comments.addField(
  {
    fieldName: 'disableNotifications',
    fieldSchema: {
      type: Boolean,
      optional: true,
      autoform: {
        omit: true
      }
    }
  }
);

// Add notifications options to user profile settings
Users.addField([
  {
    fieldName: 'telescope.notifications.users',
    fieldSchema: {
      label: 'New users',
      type: Boolean,
      optional: true,
      defaultValue: false,
      editableBy: ['admin'],
      autoform: {
        group: 'Email Notifications'
      }
    }
  },
  {
    fieldName: 'telescope.notifications.posts',
    fieldSchema: {
      label: 'New posts',
      type: Boolean,
      optional: true,
      defaultValue: false,
      editableBy: ['admin', 'member'],
      autoform: {
        group: 'Email Notifications'
      }
    }
  },
  {
    fieldName: 'telescope.notifications.comments',
    fieldSchema: {
      label: 'Comments on my posts',
      type: Boolean,
      optional: true,
      defaultValue: true,
      editableBy: ['admin', 'member'],
      autoform: {
        group: 'Email Notifications'
      }
    }
  },
  {
    fieldName: 'telescope.notifications.replies',
    fieldSchema: {
      label: 'Replies to my comments',
      type: Boolean,
      optional: true,
      defaultValue: true,
      editableBy: ['admin', 'member'],
      autoform: {
        group: 'Email Notifications'
      }
    }
  }
]);

function setNotificationDefaults (user) {
  // set notifications default preferences
  user.telescope.notifications = {
    users: false,
    posts: false,
    comments: true,
    replies: true
  };
  return user;
}
Telescope.callbacks.add("onCreateUser", setNotificationDefaults);
