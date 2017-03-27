/*

A SimpleSchema-compatible JSON schema

*/

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
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp  
    }
  },
  userId: {
    type: String,
    viewableBy: ['guests'],
    resolveAs: 'user: User',
  },
  
  // custom properties

  imageUrl: {
    label: 'Image URL',
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
  },
  body: {
    label: 'Body',
    type: String,
    optional: true,
    control: 'textarea',
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
    resolveAs: 'commentsCount: Float'
  }
};

export default schema;
