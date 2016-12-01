/*

A SimpleSchema-compatible JSON schema

*/

import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';

// define schema
const schema = {
  _id: {
    type: String,
    optional: true,
    viewableIf: ['anonymous'],
  },
  name: {
    label: 'Name',
    type: String,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    editableIf: ['default'],
  },
  createdAt: {
    type: Date,
    viewableIf: ['anonymous'],
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp  
    }
  },
  year: {
    label: 'Year',
    type: String,
    optional: true,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    editableIf: ['default'],
  },
  review: {
    label: 'Review',
    type: String,
    control: "textarea",
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    editableIf: ['default']
  },
  privateComments: {
    label: 'Private Comments',
    type: String,
    optional: true,
    control: "textarea",
    viewableIf: Users.owns,
    insertableIf: ['default'],
    editableIf: ['default']
  },
  userId: {
    type: String,
    optional: true,
    viewableIf: ['anonymous'],
    resolveAs: 'user: User',
  }
};

export default schema;


const termsSchema = `
  input Terms {
    view: String
    userId: String
    cat: String
    date: String
    after: String
    before: String
    enableCache: Boolean
    listId: String
    query: String # search query
    postId: String
  }
`;

Telescope.graphQL.addSchema(termsSchema);
