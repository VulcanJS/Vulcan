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
    resolveAs: {
      fieldName: 'user',
      type: 'User', 
      resolver(comment, args, context) {
        return context.Users.findOne({ _id: comment.userId }, { fields: context.Users.getViewableFields(context.currentUser, context.Users) });
      },
      addOriginalField: true
    }
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
  isDeleted: {
    type: Boolean,
    optional: true,
    control: 'checkbox',
    viewableBy: ['mods', 'admins', 'managers'],
    insertableBy: ['mods', 'admins', 'managers'],
    editableBy: ['mods', 'admins', 'managers'],
  },
  
};

export default schema;
