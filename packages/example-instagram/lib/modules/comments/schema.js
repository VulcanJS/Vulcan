/*

A SimpleSchema-compatible JSON schema

*/

const schema = {

  // default properties

  _id: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
  },
  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ['guests'],
    onInsert: (document, currentUser) => {
      return new Date();
    }
  },
  userId: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    resolveAs: 'user: User', // resolve as "user" on the client
  },
  
  // custom properties

  body: {
    label: 'Body',
    placeholder: 'Add a comment…',
    type: String,
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
