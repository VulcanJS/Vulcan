import Users from 'meteor/vulcan:users';

const schema = {
  _id: {
    type: String,
    viewableBy: ['members'],
  },
  createdAt: {
    type: Date,
    viewableBy: ['members'],
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp
    }
  },
  userId: {
    type: String,
    viewableBy: ['members'],
    resolveAs: 'user: User',
  },
  // custom properties
  message: {
    label: 'Message',
    placeholder: 'type a message for your reminder...',
    type: String,
    viewableBy: Users.owns,
    insertableBy: ['members'],
    editableBy: Users.owns,
  },
  deliveryTime: {
    label: 'Delivery Time',
    type: Date,
    viewableBy: Users.owns,
    insertableBy: ['members'],
    editableBy: Users.owns,
  }
};

export default schema;
