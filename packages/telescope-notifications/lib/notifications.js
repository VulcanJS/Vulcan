// add new post notification callback on post submit
postAfterSubmitMethodCallbacks.push(function (post) {
  if(Meteor.isServer){
    var userIds = Meteor.users.find({'profile.notifications.posts': 1}, {fields: {}}).map(function (user) {
      return user._id;
    });
    Herald.createNotification(userIds, {courier: 'newPost', data: post});
  }
  return post;
});

// add new comment notification callback on comment submit
commentAfterSubmitMethodCallbacks.push(function (comment) {
  if(Meteor.isServer && !comment.disableNotifications){

    var user = Meteor.users.findOne(comment.userId),
        post = Posts.findOne(comment.postId),
        notificationData = {
          comment: _.pick(comment, '_id', 'userId', 'author', 'body'),
          post: _.pick(post, '_id', 'userId', 'title', 'url')
        },
        alreadyNotified = [];

    // 1. Notify author of post
    Herald.createNotification(post.userId, {courier: 'newComment', data: notificationData});
    alreadyNotified.push(post.userId);

    // 2. Notify author of comment being replied to
    if (!!comment.parentCommentId) {
  
      var parentComment = Comments.findOne(comment.parentCommentId);

      // do not notify author of parent comment if they're also post author
      if (parentComment.userId !== post.userId) {
        
        // add parent comment to notification data
        notificationData.parentComment = _.pick(parentComment, '_id', 'userId', 'author');
        
        Herald.createNotification(parentComment.userId, {courier: 'newComment', data: notificationData});
        alreadyNotified.push(parentComment.userId);
      
      }

    }

    // 3. Notify users subscribed to the thread 
    // TODO: ideally this would be injected from the telescope-subscribe-to-posts package
    if (!!post.subscribers) {

      // remove userIds of users that have already been notified
      var userIdsToNotify = _.difference(post.subscribers, alreadyNotified);
      Herald.createNotification(userIdsToNotify, {courier: 'newCommentSubscribed', data: notificationData});

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
addToSettingsSchema.push(emailNotifications);

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
