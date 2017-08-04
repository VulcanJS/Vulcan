/*

A SimpleSchema-compatible JSON schema

*/

import Users from 'meteor/vulcan:users';

//define schema
const schema = {
  _id: {
    optional: true,
    type: String,
  },
  createdAt: {
    type: Date,
    optional: true,
    onInsert: () => {return new Date()},
  },
  userId: {
    type: String,
    viewableBy: ['members'],
    insertableBy: ['members'],
    resolveAs: {
      fieldName: 'user',
      type: 'User',
      resolver: (event, args, context) => context.Users.findOne({_id: event.userId}, {fields: context.getViewableFields(context.currentUser, context.Users)}),
      addOriginalField: true,
    },
    optional: true,
  },
  name: {
    type: String,
    viewableBy: ['members'],
    insertableBy: ['members'],
  },
  documentId: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
  },
  important: { // marking an event as important means it should never be erased
    type: Boolean,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
  },
  properties: {
    type: Object,
    optional: true,
    blackbox: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
  },
  intercom: { // whether to send this event to intercom or not
    type: Boolean,
    optional: true,
    viewableBy: ['members'],
    insertableBy: ['members'],
  }
};

export default schema;
