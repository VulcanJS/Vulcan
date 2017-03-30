/*

A SimpleSchema-compatible JSON schema

*/

import Users from 'meteor/vulcan:users';
import GraphQLSchema from 'meteor/vulcan:core';

const userInParticipants = function (user, document) {
  try {
    let conversation;
    if (document.conversation) { //Check if document is message and set conversation accordingly
      conversation = document.conversation;
    } else if (document.participants) { //Check if document is conversation
      conversation = document;
    } else { //If neither, return false
      return false;
    }
    conversation.participants.forEach(function (participant) {
      if (participant._id == user._id) {
        return true
      }
    });
  } catch (e) {
    return false; //user not logged in, or corrupt conversation
  }
};


const ConversationSchema = {
  _id: {
    type: String,
    viewableBy: userInParticipants,
  },
  createdAt: {
    type: Date,
    viewableBy: userInParticipants,
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp
    }
  },
  participantIds: {
    type: Array,
    viewableBy: userInParticipants,
    optional: true,
    resolveAs: 'participants: [User]',
  },
  'participantIds.$': {
    type: String,
    viewableBy: userInParticipants,
    optional: true,
  },
  title: {
    type: String,
    viewableBy: userInParticipants,
    editableBy: ['members'],
    insertableBy: ['members'],
  },
  latestActivity: {
    type: Date,
    viewableBy: userInParticipants,
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp
    }
  }
};

const MessageSchema = {
  _id: {
    type: String,
    viewableBy: Users.owns,
  },
  userId: {
    type: String,
    viewableBy: userInParticipants,
    insertableBy: Users.owns,
    resolveAs: 'user: User'
  },
  createdAt: {
    type: Date,
    viewableBy: userInParticipants,
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp
    },
  },
  messageMD: {
    type: String,
    viewableBy: userInParticipants,
    insertableBy: ['members'],
    editableBy: Users.owns,
    control: "textarea",
    order: 1,
    optional: true,
  },
  messageHTML: {
    type: String,
    viewableBy: userInParticipants,
    optional: true,
  },
  conversationId: {
    type: String,
    viewableBy: userInParticipants,
    insertableBy: ['members'],
    hidden: true,
    resolveAs: 'conversation: Conversation'
  },
};

export { MessageSchema, ConversationSchema }
