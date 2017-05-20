/*

A SimpleSchema-compatible JSON schema

*/

import Users from 'meteor/vulcan:users';
import GraphQLSchema from 'meteor/vulcan:core';

const schema = {
  _id: {
    type: String,
    viewableBy: ['guests'],
    optional: true,
  },
  userId: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    resolveAs: 'user: User',
    optional: true,
  },
  createdAt: {
    optional: true,
    type: Date,
    viewableBy: ['guests'],
    onInsert: (document, currentUser) => {
      return new Date();
    },
  },
  ownedByUser: {
    type: Boolean,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    optional: true,
  },
  displayFullContent: {
    type: Boolean,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    optional: true,
  },
  nickname: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    optional: true,
  },
  url: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    optional: true,
  },
  status: {
    type: String,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    optional: true,
  }
};

export default schema;
