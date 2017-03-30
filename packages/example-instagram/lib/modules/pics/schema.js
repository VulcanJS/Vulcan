/*

A SimpleSchema-compatible JSON schema

*/

import FormsUpload from 'meteor/vulcan:forms-upload';

const schema = {

  // default properties

  _id: {
    type: String,
    viewableBy: ['guests'],
  },
  createdAt: {
    type: Date,
    viewableBy: ['guests'],
    autoValue: (documentOrModifier) => {
      // if this is an insert, set createdAt to current timestamp
      if (documentOrModifier && !documentOrModifier.$set) return new Date()  
    }
  },
  userId: {
    type: String,
    viewableBy: ['guests'],
    resolveAs: 'user: User', // resolve this field as "user" on the client
  },
  
  // custom properties

  imageUrl: {
    label: 'Image URL',
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    control: FormsUpload, // use the FormsUpload form component
    form: {
      options: {
        preset: 'vulcanstagram'
      },
    }
  },
  body: {
    label: 'Body',
    type: String,
    optional: true,
    control: 'textarea', // use a textarea form component
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members']
  },

  // GraphQL-only field

  commentsCount: {
    type: Number,
    optional: true,
    viewableBy: ['guests'],
    hidden: true,
    resolveAs: 'commentsCount: Float' // resolve as commentCount on the client
  }
};

export default schema;
