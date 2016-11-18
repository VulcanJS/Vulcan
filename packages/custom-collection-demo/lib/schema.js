import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import Movies from './collection.js';

const alwaysPublic = user => true;
const isLoggedIn = user => !!user;
const canEdit = Users.canEdit;

// define schema
const schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    viewableIf: alwaysPublic
  },
  name: {
    type: String,
    control: "text",
    viewableIf: alwaysPublic,
    insertableIf: isLoggedIn,
    editableIf: canEdit
  },
  createdAt: {
    type: Date,
    viewableIf: alwaysPublic,
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp  
    }
  },
  year: {
    type: String,
    optional: true,
    control: "text",
    viewableIf: alwaysPublic,
    insertableIf: isLoggedIn,
    editableIf: canEdit
  },
  review: {
    type: String,
    control: "textarea",
    viewableIf: alwaysPublic,
    insertableIf: isLoggedIn,
    editableIf: canEdit
  },
  privateComments: {
    type: String,
    optional: true,
    control: "textarea",
    viewableIf: alwaysPublic, //fixme
    insertableIf: isLoggedIn,
    editableIf: canEdit
  },
  userId: {
    type: String,
    viewableIf: alwaysPublic,
  }
});

// attach schema to collection
Movies.attachSchema(schema);

// generate GraphQL schema from SimpleSchema schema
Telescope.graphQL.addCollection(Movies);

// make collection available to resolvers via their context
Telescope.graphQL.addToContext({ Movies });
