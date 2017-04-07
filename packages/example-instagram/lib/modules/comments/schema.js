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
      // if this is an insert, set createdAt to current timestamp
      if (documentOrModifier && !documentOrModifier.$set) return new Date() 
    }
  },
  userId: {
    type: String,
    viewableBy: ['guests'],
    resolveAs: 'user: User', // resolve as "user" on the client
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
    hidden: true, // never show this in forms
  },
  
};

export default schema;
