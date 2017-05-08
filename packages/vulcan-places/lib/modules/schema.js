/*

A SimpleSchema-compatible JSON schema

*/

const schema = {

  // default properties

  _id: { // use place id from google
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
  
  // custom properties

  name: {
    type: String,
    viewableBy: ['guests'],
  },

  location: {
    type: Object,
    viewableBy: ['guests'],
    blackbox: true
  },

  url: {
    type: String,
    viewableBy: ['guests'],
  },

  website: {
    type: String,
    viewableBy: ['guests'],
  },

  adr_address: {
    type: String,
    viewableBy: ['guests'],
  },
};

export default schema;
