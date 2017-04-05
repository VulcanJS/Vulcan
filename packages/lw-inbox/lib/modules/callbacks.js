import Notifications from '../collections/notifications/collection.js';
import Messages from '../collections/messages/collection.js';
import Conversations from '../collections/conversations/collection.js';
import Users from 'meteor/vulcan:users';
import Posts from 'meteor/vulcan:posts';
import Comments from 'meteor/vulcan:comments';
import Categories from 'meteor/vulcan:categories';
import marked from 'marked';
import { addCallback, newMutation, editMutation, Utils } from 'meteor/vulcan:core';
import { performSubscriptionAction } from 'meteor/lw-subscribe';

const updateConversationActivity = (message) => {
  // Update latest Activity timestamp on conversation when new message is added
  const user = Users.findOne(message.userId);
  const conversation = Conversations.findOne(message.conversationId);
  editMutation({
    collection: Conversations,
    documentId: conversation._id,
    set: {latestActivity: message.createdAt},
    currentUser: user,
    validate: false,
  });
};

addCallback("messages.new.async", updateConversationActivity);

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
    case "message":
      return Messages.getLink(document);
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
      return Comments.getAuthorName(document) + ' left a new comment on "' + Posts.findOne(document.postId).title + '"';
    case "newReply":
      return Comments.getAuthorName(document) + ' replied to a comment on "' + Posts.findOne(document.postId).title + '"';
    case "newUser":
      return document.displayName + ' just signed up!';
    case "newMessage":
      let conversation = Conversations.findOne(document.conversationId);
      return Users.findOne(document.userId).displayName + ' sent you a new message' + (conversation.title ? (' in the conversation ' + conversation.title) : "") + '!';
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
    case "message":
      return Messages.findOne(documentId);
    default:
      console.error("Invalid documentType type");
  }
}

/**
 * @summary Add default subscribers to the new post.
 */
const PostsNewSubscriptions = (post) => {
  // Subscribe the post's author to comment notifications for the post
  // (if they have the proper setting turned on)
  const postAuthor = Users.findOne(post.userId);
  if (Users.getSetting(postAuthor, "auto_subscribe_to_my_posts", false)) {

    performSubscriptionAction('subscribe', Posts, post._id, postAuthor);
  }
}
addCallback("posts.new.async", PostsNewSubscriptions);

/**
 * @summary Add default subscribers to the new comment.
 */
const CommentsNewSubscriptions = (comment) => {
  // Subscribe the comment's author to reply notifications for the comment
  // (if they have the proper setting turned on)
  const commentAuthor = Users.findOne(comment.userId);
  if (Users.getSetting(commentAuthor, "auto_subscribe_to_my_comments", false)) {

    performSubscriptionAction('subscribe', Comments, comment._id, commentAuthor);
  }
}
addCallback("comments.new.async", CommentsNewSubscriptions);

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
  if (post.status === Posts.config.STATUS_PENDING) {
    // if post is pending, only notify admins
    let adminIds = _.pluck(Users.adminUsers({fields: {_id:1}}), '_id');

    // remove this post's author
    adminIds = _.without(adminIds, post.userId);

    createNotifications(adminIds, 'newPendingPost', 'post', post._id);
  } else {
    // add users who get notifications for all new posts
    let usersToNotify = _.pluck(Users.find({'notifications_posts': true}, {fields: {_id:1}}).fetch(), '_id');

    // add users who are subscribed to this post's author
    const postAuthor = Users.findOne(post.userId);
    if (!!postAuthor.subscribers) {
      usersToNotify = _.union(usersToNotify, postAuthor.subscribers);
    }

    // add users who are subscribed to this post's categories
    if (!!post.categories) {
      post.categories.forEach(cid => {
        let c = Categories.findOne(cid);
        if (!!c.subscribers) {
          usersToNotify = _.union(usersToNotify, c.subscribers);
        }
      });
    }

    // remove this post's author
    usersToNotify = _.without(usersToNotify, post.userId);

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

    // 1. Notify users who are subscribed to the parent comment
    if (!!comment.parentCommentId) {
      const parentComment = Comments.findOne(comment.parentCommentId);

      if (!!parentComment.subscribers && !!parentComment.subscribers.length) {
        // remove userIds of users that have already been notified
        // and of comment author (they could be replying in a thread they're subscribed to)
        let parentCommentSubscribersToNotify = _.difference(parentComment.subscribers, notifiedUsers, [comment.userId]);
        createNotifications(parentCommentSubscribersToNotify, 'newReply', 'comment', comment._id);
        notifiedUsers = notifiedUsers.concat(parentCommentSubscribersToNotify);
      }
    }

    // 2. Notify users who are subscribed to the post (which may or may not include the post's author)
    if (!!post.subscribers && !!post.subscribers.length) {
      // remove userIds of users that have already been notified
      // and of comment author (they could be replying in a thread they're subscribed to)
      let postSubscribersToNotify = _.difference(post.subscribers, notifiedUsers, [comment.userId]);
      createNotifications(postSubscribersToNotify, 'newComment', 'comment', comment._id);
    }
  }
}
addCallback("comments.new.async", CommentsNewNotifications);

const messageNewNotification = (message) => {
  if(Meteor.isServer) {
    const conversation = Conversations.findOne(message.conversationId);
    //Make sure to not notify the author of the message
    const notifees = conversation.participantIds.filter((id) => (id != message.userId));

    createNotifications(notifees, 'newMessage', 'message', message._id);
  }
}
addCallback("messages.new.async", messageNewNotification);

const messageNewHTMLContent = (message) => {
  if(Meteor.isServer) {
    console.log("MARKDOWN PARSING", marked(message.messageMD));
    console.log("SANITIZING", Utils.sanitize(marked(message.messageMD)));
    message = {
      ...message,
      messageHTML: Utils.sanitize(marked(message.messageMD)),
    };
    console.log("MESSAGE", message);
  }
  return message;
}
addCallback("messages.new.sync", messageNewHTMLContent);
