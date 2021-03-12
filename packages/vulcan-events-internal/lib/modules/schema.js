const schema = {
  createdAt: {
    type: Date,
    canRead: ['guests'],
    optional: true,
    onInsert: () => {
      return new Date();
    }
  },
  name: {
    type: String,
    canRead: ['guests'],
    canCreate: ['guests'],
  },
  userId: {
    type: String,
    canRead: ['admins'],
    optional: true,
    resolveAs: {
      fieldName: 'user',
      typeName: 'User',
      relation: 'hasOne',
    },
  },
  description: {
    type: String,
    canRead: ['admins'],
    optional: true,
  },
  unique: {
    type: Boolean,
    canRead: ['admins'],
    optional: true,
  },
  important: {
    // marking an event as important means it should never be erased
    type: Boolean,
    canRead: ['admins'],
    optional: true,
  },
  properties: {
    type: Object,
    optional: true,
    blackbox: true,
    canRead: ['guests'],
    canCreate: ['guests'],
  },
};

export default schema;