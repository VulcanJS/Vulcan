import Notifications from './collection.js';
import Users from 'meteor/nova:users';
import { addCallback, newMutation } from 'meteor/nova:core';

// ROGTODO: actually use notificationData
const createNotifications = (userIds, documentType, notificationType, notificationData) => {
  userIds.forEach(userId => {
    let user = Users.findOne(userId);
    newMutation({
      action: 'notifications.new',
      collection: Notifications,
      document: {type: documentType, notificationMessage: notificationType},
      currentUser: user,
      validate: false
    });
  });
}

// hard dependency on Comments and Posts packages
const Comments = Package['nova:comments'].default;
const Posts = Package['nova:posts'].default;

/**
 * @summary Add notification callback when a post is approved
 */
const PostsApprovedNotification = (post) => {
  const notificationData = {
    post: _.pick(post, '_id', 'userId', 'title', 'url')
  };

  createNotifications([post.userId], 'post', 'postApproved', notificationData);
}
addCallback("posts.approve.async", PostsApprovedNotification);

/**
 * @summary Add new post notification callback on post submit
 */
const PostsNewNotifications = (post) => {

  let adminIds = _.pluck(Users.adminUsers({fields: {_id:1}}), '_id');
  let usersToNotify = _.pluck(Users.find({'notifications_posts': true}, {fields: {_id:1}}).fetch(), '_id');

  const notificationData = {
    post: _.pick(post, '_id', 'userId', 'title', 'url', 'slug')
  };

  // remove post author ID from arrays
  adminIds = _.without(adminIds, post.userId);
  usersToNotify = _.without(usersToNotify, post.userId);

  if (post.status === Posts.config.STATUS_PENDING) {
    // if post is pending, only notify admins
    createNotifications(adminIds, 'post', 'newPendingPost', notificationData);
  } else {
    // if post is approved, notify everybody
    createNotifications(usersToNotify, 'post', 'newPost', notificationData);
  }
}
addCallback("posts.new.async", PostsNewNotifications);

// add new comment notification callback on comment submit
const CommentsNewNotifications = (comment) => {

  // note: dummy content has disableNotifications set to true
  if(Meteor.isServer && !comment.disableNotifications) {

    const post = Posts.findOne(comment.postId);
    const postAuthor = Users.findOne(post.userId);
    const notificationData = {
      comment: _.pick(comment, '_id', 'userId', 'author', 'htmlBody', 'postId'),
      post: _.pick(post, '_id', 'userId', 'title', 'url')
    };

    // 1. Notify author of post (if they have new comment notifications turned on)
    //    but do not notify author of post if they're the ones posting the comment
    if (Users.getSetting(postAuthor, "notifications_comments", true) && comment.userId !== postAuthor._id) {
      createNotifications([postAuthor.userId], 'comment', 'newComment', notificationData);
    }

    // 2. Notify author of comment being replied to
    if (!!comment.parentCommentId) {
      const parentComment = Comments.findOne(comment.parentCommentId);

      // do not notify author of parent comment if they're replying to their own comment
      if (parentComment.userId !== comment.userId) {
        const parentCommentAuthor = Users.findOne(parentComment.userId);

        // do not notify parent comment author if they have reply notifications turned off
        if (Users.getSetting(parentCommentAuthor, "notifications_replies", true)) {
          // add parent comment to notification data
          notificationData.parentComment = _.pick(parentComment, '_id', 'userId', 'author', 'htmlBody');
          createNotifications([parentCommentAuthor.userId], 'comment', 'newReply', notificationData);
        }
      }
    }
  }
}

addCallback("comments.new.async", CommentsNewNotifications);
