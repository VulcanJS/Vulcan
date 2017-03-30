import {Conversations, Messages} from './collection.js';
import Users from 'meteor/vulcan:users';
import { newMutation, editMutation } from 'meteor/vulcan:core';


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
