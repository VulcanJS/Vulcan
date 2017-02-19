/*

A SimpleSchema-compatible JSON schema

*/

import Users from 'meteor/nova:users';

// define schema
const schema = {
  _id: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
  },
  name: {
    label: 'Name',
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
  },
  createdAt: {
    type: Date,
    viewableBy: ['guests'],
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp  
    }
  },
  year: {
    label: 'Year',
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
  },
  review: {
    label: 'Review',
    type: String,
    control: 'textarea',
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members']
  },
  privateComments: {
    label: 'Private Comments',
    type: String,
    optional: true,
    control: 'textarea',
    viewableBy: Users.owns,
    insertableBy: ['members'],
    editableBy: ['members']
  },
  userId: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    resolveAs: 'user: User',
  }
};

export default schema;
