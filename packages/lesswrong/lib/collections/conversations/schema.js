/*

A SimpleSchema-compatible JSON schema

*/

import Users from 'meteor/vulcan:users';
import GraphQLSchema from 'meteor/vulcan:core';

const schema = {
  _id: {
    optional: true,
    type: String,
    viewableBy: ['members'],
  },
  createdAt: {
    optional: true,
    type: Date,
    viewableBy: ['members'],
    onInsert: (document) => {
      return new Date();
    }
  },
  participantIds: {
    type: Array,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members'],
    optional: true,
    hidden: true,
    resolveAs: {
      fieldName: 'participants',
      type: '[User]',
      resolver: (conversation, args, context) => {
        return _.map(conversation.participantIds,
          (participantId => {return context.Users.findOne({ _id: participantId }, { fields: context.Users.getViewableFields(context.currentUser, context.Users) })})
        )
      },
      addOriginalField: true
    }
  },

  'participantIds.$': {
    type: String,
    optional: true,
  },

  title: {
    type: String,
    viewableBy: ['members'],
    editableBy: ['members'],
    insertableBy: ['members'],
  },
  latestActivity: {
    type: Date,
    viewableBy: ['members'],
    onInsert: (document) => {
      return new Date(); // if this is an insert, set createdAt to current timestamp
    },
    optional: true,
  }
};

export default schema;
