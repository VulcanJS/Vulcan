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
    hidden: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    resolveAs: 'user: User',
    onInsert: (document, currentUser) => {
      currentUser._id;
    },
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
    control: "checkbox",
    optional: true,
    order: 30,
    defaultValue: false,
  },
  displayFullContent: {
    type: Boolean,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    control: "checkbox",
    optional: true,
    order: 40,
    defaultValue: false,
  },
  nickname: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    optional: true,
    order: 10,
  },
  url: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    optional: true,
    order: 20,
  },
  status: {
    type: String,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    optional: true,
  },
  rawFeed: {
    type: Object,
    hidden: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    optional: true,
  }
};

export default schema;
