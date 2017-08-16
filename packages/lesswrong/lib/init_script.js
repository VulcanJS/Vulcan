import Conversations from './collections/conversations/collection.js';
import Messages from './collections/messages/collection.js';
import Notifications from './collections/notifications/collection.js';

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

//
if(Notifications.find().fetch().length === 0) {
  _.times(10, (i) => {
    Users.find().fetch().forEach(user => {
      let notificationType, notificationSeed, notification;
      Posts.find().fetch().forEach(post => {
        notificationType = _.sample(["newPost", "newPendingPost", "postApproved"]);
        notificationSeed = {
          userId: user._id,
          notificationType: notificationType,
          notificationMessage: notificationMessage(notificationType, "post", post._id),
          documentType: "post",
          documentId: post._id,
          link: getLink("post", post._id),
        };
        notification = newMutation({
          action: 'notification.new',
          collection: Notifications,
          document: notificationSeed,
          currentUser: user,
          validate: false,
        });
      });
      Comments.find().fetch().forEach(comment => {
        notificationType = _.sample(["newComment", "newReply"]);
        notificationSeed = {
          userId: user._id,
          notificationType: notificationType,
          notificationMessage: notificationMessage(notificationType, "comment", comment._id),
          documentType: "comment",
          documentId: comment._id,
          link: getLink("comment", comment._id),
        };
        notification = newMutation({
          action: 'notification.new',
          collection: Notifications,
          document: notificationSeed,
          currentUser: user,
          validate: false,
        });
      });
      Users.find().fetch().forEach(user2 => {
        notificationType = "newUser";
        notificationSeed = {
          userId: user._id,
          notificationType: notificationType,
          notificationMessage: notificationMessage(notificationType, "user", user2._id),
          documentType: "user",
          documentId: user2._id,
          link: getLink("user", user2._id)
        };
        notification = newMutation({
          action: 'notification.new',
          collection: Notifications,
          document: notificationSeed,
          currentUser: user,
          validate: false,
        });
      });
    });
  });
}

// _.times(10, (i) => {
//   Users.find().fetch().forEach(user => {
//     let conversationSeed = {
//       participantIds: ["BqAZzcjZGZuR8pP4R", user._id],
//       messageIds: []
//     };
//     let conversation = newMutation({
//       action: 'conversations.new',
//       collection: Conversations,
//       document: conversationSeed,
//       currentUser: user,
//       validate: false,
//     });
//     _.times(_.random(1,50), (j) => {
//       let randomMessenger = _.sample(["BqAZzcjZGZuR8pP4R", user._id]);
//       let randomMessage = _.sample(["YOOOO, How is it going?", "SGASJDASL", "GOOD", "BAD"]) + _.random(0,1000);
//       let messageSeed = {
//         userId: randomMessenger,
//         messageMD: randomMessage,
//         messageHTML: randomMessage,
//         conversationId: conversation._id,
//       };
//       console.log(messageSeed);
//       let message = newMutation({
//         action: 'messages.new',
//         collection: Messages,
//         document: messageSeed,
//         currentUser: user,
//         validate: false,
//       });
//     });
//   });
// });


// Users.find().fetch().forEach(user => {
//   let conversationSeed = {
//     participantIds: [user._id, "BqAZzcjZGZuR8pP4R"],
//     messageIds: [],
//   };
//   let conversation = newMutation({
//     action: 'conversations.new',
//     collection: Conversations,
//     document: conversationSeed,
//     currentUser: user,
//     validate: false,
//   });
//
//   Users.find().fetch().forEach(user2 => {
//     let messageSeed = {
//       userId: user2._id,
//       messageMD: "Hey, I am: " + user2._id + " aka " + user2.displayName,
//       messageHTML: "Hey, I am: " + user2._id + " aka " + user2.displayName,
//       conversationId: conversation._id,
//     };
//     let message = newMutation({
//       action: 'messages.new',
//       collection: Messages,
//       document: messageSeed,
//       currentUser: user,
//       validate: false,
//     });
//   })
// })

//
// if (Conversations.find().fetch().length === 0) {
//   const currentUser = Users.findOne();
//   seedData.forEach(document => {
//     newMutation({
//       action: 'conversations.new',
//       collection: Conversations,
//       document: document,
//       currentUser: currentUser,
//       validate: false
//     });
//   });
// }
//
// if (Messages.find().fetch().length === 0) {
//   const currentUser = Users.findOne();
//   messagesSeedData.forEach(document => {
//     newMutation({
//       action: 'messages.new',
//       collection: Messages,
//       document: document,
//       currentUser: currentUser,
//       validate: false
//     });
//   })
// }

// Messages.find().fetch().forEach(message => {
//   console.log(message);
//   let currentUser = Users.findOne();
//   Conversations.find().fetch().forEach(conversation => {
//     console.log(conversation);
//     var messages = conversation.messageIds;
//     messages.push(message._id);
//     console.log(messages);
//     console.log("Post-Mutation");
//     console.log(editMutation({
//       collection: Conversations,
//       documentId: conversation._id,
//       set: {messageIds: ["WSi2fF4PzyAJTBSxR"]},
//       validate: false,
//       currentUser: currentUser,
//     }));
//   });
// });
