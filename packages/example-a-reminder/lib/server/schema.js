import Users from 'meteor/vulcan:users';

const schema = {
  _id: {
    type: String,
    type: String,
    viewableBy: Users.owns,
  },
  createdAt: {
    type: Date,
    viewableBy: Users.owns,
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp
    }
  },
  userId: {
    type: String,
    viewableBy: Users.owns,
    resolveAs: 'user: User',
  },

  // custom properties
  message: {
    label: 'Message',
    type: String,
    viewableBy: Users.owns,
    insertableBy: ['members'],
    editableBy: ['members'],
  },

  deliveryTime{
    label: 'Delivery Time',
    type: Date,
    viewableBy: Users.owns,
    insertableBy: ['members'],
    editableBy: ['members'],
  }
}

};

export default schema;


}
