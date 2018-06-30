const schema = {
  createdAt: {
    type: Date,
    canRead: ['guests'],
    optional: true,
    onInsert: () => {
      return new Date()
    }
  },
  name: {
    type: String,
    canRead: ['guests'],
    canCreate: ['guests'],
  },
  userId: {
    type: String,
    optional: true,
  },
  description: {
    type: String,
    optional: true,
  },
  unique: {
    type: Boolean,
    optional: true,
  },
  important: {
    // marking an event as important means it should never be erased
    type: Boolean,
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