/*

A SimpleSchema-compatible JSON schema

*/

import FormsUpload from 'meteor/vulcan:forms-upload';

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
      resolver(pic, args, context) {
        return context.Users.findOne({ _id: pic.userId }, { fields: context.Users.getViewableFields(context.currentUser, context.Users) });
      },
      addOriginalField: true
    }
  },
  
  // custom properties

  imageUrl: {
    label: 'Image URL',
    type: String,
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
    resolveAs: {
      fieldName: 'commentsCount',
      type: 'Float',
      resolver(pic, args, context) {
        return context.Comments.find({picId: pic._id, isDeleted: {$ne: true}}).count();
      }
    }
  },

  managerId: {
    type: String,
    optional: true,
    viewableBy: ['members'],
    editableBy: ['admins'],
    insertableBy: ['admins'],
    resolveAs: {
      fieldName: 'manager',
      type: 'User',
      resolver(pic, args, context) {
        return context.Users.findOne({ _id: pic.managerId }, { fields: context.Users.getViewableFields(context.currentUser, context.Users) });
      },
      addOriginalField: true
    }
  },
};

export default schema;
