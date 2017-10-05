/*

Comment notification callbacks

*/

import Users from 'meteor/vulcan:users';
import { addCallback } from 'meteor/vulcan:core';
import { createNotification } from '../../email/notifications.js';
import { Posts } from '../../../modules/posts/index.js';
import { Comments } from '../../../modules/comments/index.js';

// add new comment notification callback on comment submit
function CommentsNewNotifications (comment) {

  // note: dummy content has disableNotifications set to true
  if(Meteor.isServer && !comment.disableNotifications) {

    const post = Posts.findOne(comment.postId);
    const postAuthor = Users.findOne(post.userId);


    let userIdsNotified = [];

    // 1. Notify author of post (if they have new comment notifications turned on)
    //    but do not notify author of post if they're the ones posting the comment
    if (Users.getSetting(postAuthor, 'notifications_comments', false) && comment.userId !== postAuthor._id) {
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
        if (Users.getSetting(parentCommentAuthor, 'notifications_replies', false)) {
          createNotification(parentComment.userId, 'newReply', {documentId: parentComment._id});
          userIdsNotified.push(parentComment.userId);
        }
      }

    }

  }
}
addCallback('comments.new.async', CommentsNewNotifications);
