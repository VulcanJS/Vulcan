/*

A SimpleSchema-compatible JSON schema

*/

import Users from 'meteor/nova:users';

const checkUser = (user, document) => {
  if(!document){
    return false;
  }
  return user.userId == document.userId;
}

//define schema
const schema = {
  _id: {
    type: String,
    viewableBy: checkUser,
  },
  userId: {
    type: String,
    viewableBy: checkUser,
  },
  createdAt: {
    type: Date,
    viewableBy: checkUser,
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp
    }
  },
  documentId: {
    type: String,
    optional: true,
    viewableBy: checkUser,
  },
  documentType: {
    type: String,
    optional: true,
    viewableBy: checkUser,
  },
  link: {
    type: String,
    optional: true,
    viewableBy: checkUser,
  },
  notificationMessage: {
    type: String,
    optional: true,
    viewableBy: checkUser,
  },
  notificationType: {
    type: String,
    optional: true,
    viewableBy: checkUser,
  },
  viewed: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    viewableBy: checkUser,
    insertableBy: checkUser,
    editableBy: checkUser,
  },
};

export default schema;
