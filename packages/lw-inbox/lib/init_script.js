import {Conversations, Messages} from './collection.js';
import Users from 'meteor/vulcan:users';
import { newMutation, editMutation } from 'meteor/vulcan:core';


const seedData = [
  {
    participants: ["9t5FHbDJh7ESoZhYR", "mWMpozheAQGzBbr9w"],
    messageIds: [],
  },
  {
    participants: ["9t5FHbDJh7ESoZhYR", "aHg9bEM2Gvauj2Me9"],
    messageIds: [],
  },
  {
    participants: ["9t5FHbDJh7ESoZhYR", "2ZSdn9QyJJ57RTyaN"],
    messageIds: [],
  },
];

const messagesSeedData = [
  {
    userId: "9t5FHbDJh7ESoZhYR",
    messageMD: "YOOOOO 1",
    messageHTML: "YOOOOO 1",
    conversationId: "QagZK63XNXApcpYTz"
  },
  {
    userId: "9t5FHbDJh7ESoZhYR",
    messageMD: "YOOOOO 2",
    messageHTML: "YOOOOO 2",
    conversationId: "QKgLd5DKTGn9AcTqh"
  },
  {
    userId: "9t5FHbDJh7ESoZhYR",
    messageMD: "YOOOOO 3",
    messageHTML: "YOOOOO 3",
    conversationId: "LxqWrDwvNnhHnHcJi"
  },
]


if (Conversations.find().fetch().length === 0) {
  const currentUser = Users.findOne();
  seedData.forEach(document => {
    newMutation({
      action: 'conversations.new',
      collection: Conversations,
      document: document,
      currentUser: currentUser,
      validate: false
    });
  });
}

if (Messages.find().fetch().length === 0) {
  const currentUser = Users.findOne();
  messagesSeedData.forEach(document => {
    newMutation({
      action: 'messages.new',
      collection: Messages,
      document: document,
      currentUser: currentUser,
      validate: false
    });
  })
}

// Messages.find().fetch().forEach(document => {
//   let conversationId = document.conversationId;
//   let conversation = Conversations.findOne({_id: conversationId});
//   let messages = [];
//   messages.push(document._id);
//   let currentUser = Users.findOne();
//   editMutation({
//     collection: Conversations,
//     documentId: conversationId,
//     set: {messageIds: messages},
//     validate: false,
//     currentUser: currentUser,
//   });
// });
