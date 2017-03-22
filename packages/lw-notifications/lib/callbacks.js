import Notifications from './collection.js';
import Users from 'meteor/nova:users';
import Comments from 'meteor/nova:comments';
import Posts from 'meteor/nova:posts';
import { addCallback, newMutation } from 'meteor/nova:core';

const createNotifications = (userIds, notificationType, documentType, documentId) => {
  userIds.forEach(userId => {

    let user = Users.findOne(userId);

    let notificationData = {
      userId: userId,
      documentId: documentId,
      documentType: documentType,
      notificationMessage: notificationMessage(notificationType, documentType, documentId),
      notificationType: notificationType,
      link: getLink(documentType, documentId),
    }

    newMutation({
      action: 'notifications.new',
      collection: Notifications,
      document: notificationData,
      currentUser: user,
      validate: false
    });
  });
}

const getLink = (documentType, documentId) => {
  let document = getDocument(documentType, documentId);
  switch(documentType) {
    case "post":
      return Posts.getPageUrl(document);
    case "comment":
      return Comments.getPageUrl(document);
    case "user":
      return Users.getProfileUrl(document, false);
    default:
      console.error("Invalid notification type");
  }
}

const notificationMessage = (notificationType, documentType, documentId) => {
  let document = getDocument(documentType, documentId);
  switch(notificationType) {
    case "newPost":
      return Posts.getAuthorName(document) + ' has created a new post: ' + document.title;
    case "newPendingPost":
      return Posts.getAuthorName(document) + ' has a new post pending approval ' + document.title;
    case "postApproved":
      return 'Your post "' + document.title + '" has been approved';
    case "newComment":
      return Comments.getAuthorName(document) + ' left a new comment on your post "' + Posts.getDocument(document.postId).title + '"';
    case "newReply":
      return Comments.getAuthorName(document) + ' replied to your comment on ' + Posts.getDocument(document.postId).title + '"';
    case "newCommentSubscribed":
      return Comments.getAuthorName(document) + ' left a new comment on ' + Posts.getDocument(document.postId).title + '"';
    case "newUser":
      return user.displayName + ' just signed up!';
    default:
      console.error("Invalid notification type");
  }
}

const getDocument = (documentType, documentId) => {
  switch(documentType) {
    case "post":
      return Posts.findOne(documentId);
    case "comment":
      return Comments.findOne(documentId);
    case "user":
      return Users.findOne(documentId);
    default:
      console.error("Invalid documentType type");
  }
}

/**
 * @summary Add notification callback when a post is approved
 */
const PostsApprovedNotification = (post) => {
  createNotifications([post.userId], 'postApproved', 'post', post._id);
}
addCallback("posts.approve.async", PostsApprovedNotification);

/**
 * @summary Add new post notification callback on post submit
 */
const PostsNewNotifications = (post) => {

  let adminIds = _.pluck(Users.adminUsers({fields: {_id:1}}), '_id');
  let usersToNotify = _.pluck(Users.find({'notifications_posts': true}, {fields: {_id:1}}).fetch(), '_id');

  // remove post author ID from arrays
  adminIds = _.without(adminIds, post.userId);
  usersToNotify = _.without(usersToNotify, post.userId);

  if (post.status === Posts.config.STATUS_PENDING) {
    // if post is pending, only notify admins
    createNotifications(adminIds, 'newPendingPost', 'post', post._id);
  } else {
    // if post is approved, notify everybody
    createNotifications(usersToNotify, 'newPost', 'post', post._id);
  }
}
addCallback("posts.new.async", PostsNewNotifications);

// add new comment notification callback on comment submit
const CommentsNewNotifications = (comment) => {

  // note: dummy content has disableNotifications set to true
  if(Meteor.isServer && !comment.disableNotifications) {

    const post = Posts.findOne(comment.postId);

    // keep track of whom we've notified (so that we don't notify the same user twice for one comment,
    // if e.g. they're both the author of the post and the author of a comment being replied to)
    let notifiedUsers = [];

    // 1. Notify author of comment being replied to
    if (!!comment.parentCommentId) {
      const parentComment = Comments.findOne(comment.parentCommentId);

      // do not notify author of parent comment if they're replying to their own comment
      if (parentComment.userId !== comment.userId) {
        const parentCommentAuthor = Users.findOne(parentComment.userId);

        // do not notify parent comment author if they have reply notifications turned off
        if (Users.getSetting(parentCommentAuthor, "notifications_replies", true)) {
          createNotifications([parentCommentAuthor.userId], 'newReply', 'comment', comment._id);
          notifiedUsers.push(parentCommentAuthor.userId);
        }
      }
    }

    // 2. Notify author of post (if they have new comment notifications turned on)
    //    but do not notify author of post if they're the ones posting the comment
    //    nor if we just sent them a newReply notification above
    const postAuthor = Users.findOne(post.userId);
    if (comment.userId !== postAuthor._id && !_.contains(notifiedUsers, postAuthor._id)
        && Users.getSetting(postAuthor, "notifications_comments", true)) {

      createNotifications([postAuthor._id], 'newComment', 'comment', comment._id);
      notifiedUsers.push(postAuthor._id);
    }

    // ROGTODO: allow author to unsubscribe, and only notify subscribers
    // 3. Notify users who are subscribed to the post
    if (!!post.subscribers && !!post.subscribers.length) {
      // remove userIds of users that have already been notified
      // and of comment author (they could be replying in a thread they're subscribed to)
      let subscribersToNotify = _.difference(post.subscribers, notifiedUsers, [comment.userId]);
      createNotifications(subscribersToNotify, 'newCommentSubscribed', 'comment', comment._id);
    }
  }
}
addCallback("comments.new.async", CommentsNewNotifications);
