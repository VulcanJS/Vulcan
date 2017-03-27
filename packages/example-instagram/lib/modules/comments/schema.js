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

  body: {
    label: 'Body',
    placeholder: 'Add a comment…',
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members']
  },
  picId: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    hidden: true,
  },
  
};

export default schema;
