/*

A SimpleSchema-compatible JSON schema

*/

const schema = {
  _id: {
    type: String,
    viewableBy: ['guests'],
    optional: true,
  },
  userId: {
    type: String,
    hidden: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    resolveAs: {
      fieldName: 'user',
      type: 'User',
      resolver: (feed, args, context) => context.Users.findOne({_id: feed.userId}, {fields: context.getViewableFields(context.currentUser, context.Users)}),
      addOriginalField: true,
    },
    optional: true,
  },
  createdAt: {
    optional: true,
    type: Date,
    viewableBy: ['guests'],
    onInsert: (document, currentUser) => {
      return new Date();
    },
  },
  ownedByUser: {
    type: Boolean,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    control: "checkbox",
    optional: true,
    order: 30,
    defaultValue: false,
  },
  displayFullContent: {
    type: Boolean,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    control: "checkbox",
    optional: true,
    order: 40,
    defaultValue: false,
  },
  nickname: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    optional: true,
    order: 10,
  },
  url: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    optional: true,
    order: 20,
  },
  status: {
    type: String,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    optional: true,
  },
  rawFeed: {
    type: Object,
    hidden: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['admins'],
    optional: true,
  }
};

export default schema;
