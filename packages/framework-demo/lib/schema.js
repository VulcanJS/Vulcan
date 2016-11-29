/*

A SimpleSchema-compatible JSON schema

*/

import Telescope from 'meteor/nova:lib';
import mutations from './mutations.js';

const alwaysPublic = user => true;
const isLoggedIn = user => !!user;
const canEdit = mutations.edit.check;

// define schema
const schema = {
  _id: {
    type: String,
    optional: true,
    viewableIf: alwaysPublic,
  },
  name: {
    label: 'Name',
    type: String,
    viewableIf: alwaysPublic,
    insertableIf: ['default'],
    editableIf: ['default'],
  },
  createdAt: {
    type: Date,
    viewableIf: alwaysPublic,
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp  
    }
  },
  year: {
    label: 'Year',
    type: String,
    optional: true,
    viewableIf: alwaysPublic,
    insertableIf: ['default'],
    editableIf: ['default'],
  },
  review: {
    label: 'Review',
    type: String,
    control: "textarea",
    viewableIf: alwaysPublic,
    insertableIf: ['default'],
    editableIf: ['default']
  },
  privateComments: {
    label: 'Private Comments',
    type: String,
    optional: true,
    control: "textarea",
    viewableIf: alwaysPublic, //fixme
    insertableIf: ['default'],
    editableIf: ['default']
  },
  userId: {
    type: String,
    optional: true,
    viewableIf: alwaysPublic,
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
