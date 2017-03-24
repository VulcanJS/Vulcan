/*

A SimpleSchema-compatible JSON schema

*/

import Users from 'meteor/nova:users';
import GraphQLSchema from 'meteor/nova:core';

const userInParticipants = function (user, document) {
  try {
    document.participants.forEach(function (participant) {
      if (participant._id == user._id) {
        return true
      }
    });
  } catch (e) {
    return false; //user not logged in, or corrupt conversation
  }
}

//define schema
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
  participants: {
    type: [String],
    viewableBy: userInParticipants,
    editableBy: userInParticipants,
    insertableBy: userInParticipants,
    optional: true,
    resolveAs: 'participants: [User]',
  },
  messages: {
    type: [String],
    viewableBy: userinParticipants,
    insertableBy: userinParticipants,
    optional: true,
    resolveAs: 'messages: [Message]',
  }
};

export default schema;
