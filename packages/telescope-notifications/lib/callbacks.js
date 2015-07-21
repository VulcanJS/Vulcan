// ------------------------------------------------------------------------------------------- //
// -----------------------------------------  Posts ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

// add new post notification callback on post submit
function postSubmitNotification (post) {

  var adminIds = _.pluck(Users.find({'isAdmin': true}, {fields: {_id:1}}).fetch(), '_id');
  var notifiedUserIds = _.pluck(Users.find({'telescope.notifications.posts': true}, {fields: {_id:1}}).fetch(), '_id');
  var notificationData = {
    post: _.pick(post, '_id', 'userId', 'title', 'url')
  };

  // remove post author ID from arrays
  adminIds = _.without(adminIds, post.userId);
  notifiedUserIds = _.without(notifiedUserIds, post.userId);

  if (post.status === Posts.config.STATUS_PENDING && !!adminIds.length) {
    // if post is pending, only notify admins
    Herald.createNotification(adminIds, {courier: 'newPendingPost', data: notificationData});
  } else if (!!notifiedUserIds.length) {
    // if post is approved, notify everybody
    Herald.createNotification(notifiedUserIds, {courier: 'newPost', data: notificationData});
  }

}
Telescope.callbacks.add("postSubmitAsync", postSubmitNotification);

function postApprovedNotification (post) {
  
  var notificationData = {
    post: _.pick(post, '_id', 'userId', 'title', 'url')
  };

  Herald.createNotification(post.userId, {courier: 'postApproved', data: notificationData});
}
Telescope.callbacks.add("postApprovedAsync", postApprovedNotification);

// ------------------------------------------------------------------------------------------- //
// ---------------------------------------- Comments ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// add new comment notification callback on comment submit
function commentSubmitNotifications (comment) {

  if(Meteor.isServer && !comment.disableNotifications){

    var post = Posts.findOne(comment.postId),
        postAuthor = Users.findOne(post.userId),
        userIdsNotified = [],
        notificationData = {
          comment: _.pick(comment, '_id', 'userId', 'author', 'htmlBody'),
          post: _.pick(post, '_id', 'userId', 'title', 'url')
        };


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
          notificationData.parentComment = _.pick(parentComment, '_id', 'userId', 'author', 'htmlBody');

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
}
Telescope.callbacks.add("commentSubmitAsync", commentSubmitNotifications);