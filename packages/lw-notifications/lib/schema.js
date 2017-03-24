/*

A SimpleSchema-compatible JSON schema

*/

import Users from 'meteor/nova:users';

//define schema
const schema = {
  _id: {
    type: String,
    viewableBy: Users.owns,
  },
  userId: {
    type: String,
    viewableBy: Users.owns,
  },
  createdAt: {
    type: Date,
    viewableBy: Users.owns,
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp
    }
  },
  documentId: {
    type: String,
    optional: true,
    viewableBy: Users.owns,
  },
  documentType: {
    type: String,
    optional: true,
    viewableBy: Users.owns,
  },
  link: {
    type: String,
    optional: true,
    viewableBy: Users.owns,
  },
  notificationMessage: {
    type: String,
    optional: true,
    viewableBy: Users.owns,
  },
  notificationType: {
    type: String,
    optional: true,
    viewableBy: Users.owns,
  },
  viewed: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    viewableBy: Users.owns,
    insertableBy: Users.owns,
    editableBy: Users.owns,
  },
};

export default schema;
