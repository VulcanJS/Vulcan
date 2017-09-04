import Users from 'meteor/vulcan:users';
import { addCallback } from 'meteor/vulcan:core';
import { createNotification } from './notifications.js';

// note: leverage weak dependencies on packages
const Comments = Package['vulcan:comments'] ? Package['vulcan:comments'].default : null;
const Posts = Package['vulcan:posts'] ? Package['vulcan:posts'].default : null;

/**
 * @summary Add notification callback when a post is approved
 */
function PostsApprovedNotification (post) {
  createNotification(post.userId, 'postApproved', {documentId: post._id});
}

/**
 * @summary Add new post notification callback on post submit
 */
function PostsNewNotifications (post) {

  let adminIds = _.pluck(Users.adminUsers({fields: {_id:1}}), '_id');
  let notifiedUserIds = _.pluck(Users.find({'notifications_posts': true}, {fields: {_id:1}}).fetch(), '_id');

  // remove post author ID from arrays
  adminIds = _.without(adminIds, post.userId);
  notifiedUserIds = _.without(notifiedUserIds, post.userId);

  if (post.status === Posts.config.STATUS_PENDING && !!adminIds.length) {
    // if post is pending, only notify admins
    createNotification(adminIds, 'newPendingPost', {documentId: post._id});
  } else if (!!notifiedUserIds.length) {
    // if post is approved, notify everybody
    createNotification(notifiedUserIds, 'newPost', {documentId: post._id});
  }

}

addCallback("posts.approve.async", PostsApprovedNotification);
addCallback("posts.new.async", PostsNewNotifications);

// add new comment notification callback on comment submit
function CommentsNewNotifications (comment) {

  // note: dummy content has disableNotifications set to true
  if(Meteor.isServer && !comment.disableNotifications) {

    const post = Posts.findOne(comment.postId);
    const postAuthor = Users.findOne(post.userId);


    let userIdsNotified = [];

    // 1. Notify author of post (if they have new comment notifications turned on)
    //    but do not notify author of post if they're the ones posting the comment
    if (Users.getSetting(postAuthor, "notifications_comments", false) && comment.userId !== postAuthor._id) {
      createNotification(post.userId, 'newComment', {documentId: comment._id});
      userIdsNotified.push(post.userId);
    }

    // 2. Notify author of comment being replied to
    if (!!comment.parentCommentId) {

      const parentComment = Comments.findOne(comment.parentCommentId);

      // do not notify author of parent comment if they're also post author or comment author
      // (someone could be replying to their own comment)
      if (parentComment.userId !== post.userId && parentComment.userId !== comment.userId) {

        const parentCommentAuthor = Users.findOne(parentComment.userId);

        // do not notify parent comment author if they have reply notifications turned off
        if (Users.getSetting(parentCommentAuthor, "notifications_replies", false)) {
          createNotification(parentComment.userId, 'newReply', {documentId: parentComment._id});
          userIdsNotified.push(parentComment.userId);
        }
      }

    }

  }
}

addCallback("comments.new.async", CommentsNewNotifications);
