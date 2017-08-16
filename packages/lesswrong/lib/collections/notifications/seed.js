import Conversations from '../conversations/collection.js';
import Notifications from '../notifications/collection.js';

import Users from 'meteor/vulcan:users';
import Posts from 'meteor/vulcan:posts';
import Comments from 'meteor/vulcan:comments';

import { newMutation, editMutation } from 'meteor/vulcan:core';

// Notifications Seed Data

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
};

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
    default:
      console.error("Invalid notification type");
  }
};


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
};

const userId = "XtphY3uYHwruKqDyG";

if(Notifications.find({userId: userId}).fetch().length === 0) {
  _.times(10, (i) => {
    Posts.find({},{limit: 10}).fetch().slice(0,10).forEach(post => {
      const notificationType = _.sample(["newPost", "newPendingPost", "postApproved"]);
      const notificationSeed = {
        userId: userId,
        notificationType: notificationType,
        notificationMessage: notificationMessage(notificationType, "post", post._id),
        documentType: "post",
        documentId: post._id,
        link: getLink("post", post._id),
      };
      let notification = newMutation({
        action: 'notification.new',
        collection: Notifications,
        document: notificationSeed,
        currentUser: user,
        validate: false,
      });
      console.log("Created Notification", notification);
    })
  })
}

// if(Notifications.find().fetch().length === 0) {
//   _.times(10, (i) => {
//     Users.find().fetch().forEach(user => {
//       let notificationType, notificationSeed, notification;
//       Posts.find().fetch().forEach(post => {
//         notificationType = _.sample(["newPost", "newPendingPost", "postApproved"]);
//         notificationSeed = {
//           userId: user._id,
//           notificationType: notificationType,
//           notificationMessage: notificationMessage(notificationType, "post", post._id),
//           documentType: "post",
//           documentId: post._id,
//           link: getLink("post", post._id),
//         };
//         notification = newMutation({
//           action: 'notification.new',
//           collection: Notifications,
//           document: notificationSeed,
//           currentUser: user,
//           validate: false,
//         });
//       });
//       Comments.find().fetch().forEach(comment => {
//         notificationType = _.sample(["newComment", "newReply"]);
//         notificationSeed = {
//           userId: user._id,
//           notificationType: notificationType,
//           notificationMessage: notificationMessage(notificationType, "comment", comment._id),
//           documentType: "comment",
//           documentId: comment._id,
//           link: getLink("comment", comment._id),
//         };
//         notification = newMutation({
//           action: 'notification.new',
//           collection: Notifications,
//           document: notificationSeed,
//           currentUser: user,
//           validate: false,
//         });
//       });
//       Users.find().fetch().forEach(user2 => {
//         notificationType = "newUser";
//         notificationSeed = {
//           userId: user._id,
//           notificationType: notificationType,
//           notificationMessage: notificationMessage(notificationType, "user", user2._id),
//           documentType: "user",
//           documentId: user2._id,
//           link: getLink("user", user2._id)
//         };
//         notification = newMutation({
//           action: 'notification.new',
//           collection: Notifications,
//           document: notificationSeed,
//           currentUser: user,
//           validate: false,
//         });
//       });
//     });
//   });
// }
