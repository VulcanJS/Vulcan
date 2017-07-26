
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
  },
  
  // custom properties

  tokenId: {
    type: String,
    optional: false,
  },

  productKey: {
    type: String,
    optional: true,
  },

  type: {
    type: String,
    optional: false,
  },

  test: {
    type: Boolean,
    optional: true,
  },

  data: {
    type: Object,
    blackbox: true,
  },

  properties: {
    type: Object,
    blackbox: true,
  },

  ip: {
    type: String,
    optional: true,
  },

};

export default schema;
