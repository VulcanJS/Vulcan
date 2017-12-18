const schema = {
  createdAt: {
    type: Date,
    optional: true,
    onInsert: () => {
      return new Date()
    }
  },
  name: {
    type: String,
    insertableBy: ['guests'],
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
    insertableBy: ['guests'],
  },
};

export default schema;