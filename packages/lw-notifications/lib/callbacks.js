import Notifications from './collection.js';
import Users from 'meteor/nova:users';
import { addCallback, newMutation } from 'meteor/nova:core';

const createNotification = (user, type, notificationData) => {
  newMutation({
    action: 'notifications.new',
    collection: Notifications,
    document: null,
    currentUser: user,
    notificationMessage: type,
    validate: true
  });
}

// note: leverage weak dependencies on packages
const Comments = Package['nova:comments'] ? Package['nova:comments'].default : null;

if (!!Comments) {
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
        createNotification(postAuthor, 'newComment', notificationData);
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
            createNotification(parentCommentAuthor, 'newReply', notificationData);
          }
        }
      }
    }
  }
  
  addCallback("comments.new.async", CommentsNewNotifications); 
}
