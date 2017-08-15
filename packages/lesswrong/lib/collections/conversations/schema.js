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


const schema = {
  _id: {
    optional: true,
    type: String,
    viewableBy: userInParticipants,
  },
  createdAt: {
    optional: true,
    type: Date,
    viewableBy: userInParticipants,
    onInsert: (document) => {
      return new Date();
    }
  },
  participantIds: {
    type: Array,
    viewableBy: userInParticipants,
    insertableBy: ['members'],
    editableBy: ['admins'],
    optional: true,
    hidden: true,
    resolveAs: {
      fieldName: 'participants',
      type: 'Participant',
      resolver: (conversation, args, context) => {
        return _.map(conversation.paricipantIds,
          (participantId => {context.Users.findOne({ _id: participantId }, { fields: context.Users.getViewableFields(context.currentUser, context.Users) })})
        )
      },
      addOriginalField: true
    }
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
    onInsert: (document) => {
      return new Date(); // if this is an insert, set createdAt to current timestamp
    },
    optional: true,
  }
};

export default schema;
