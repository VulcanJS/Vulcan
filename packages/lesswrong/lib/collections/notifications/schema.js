/*

A SimpleSchema-compatible JSON schema

*/

import Users from 'meteor/vulcan:users';

//define schema
const schema = {
  _id: {
    optional: true,
    type: String,
    viewableBy: Users.owns,
  },
  userId: {
    type: String,
    viewableBy: Users.owns,
  },
  createdAt: {
    optional: true,
    type: Date,
    viewableBy: Users.owns,
    onInsert: (document, currentUser) => {
      return new Date();
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
