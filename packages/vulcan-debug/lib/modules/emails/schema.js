const schema = {

  name: {
    type: String,
    canRead: ['admins'],
  },

  template: {
    type: String,
    canRead: ['admins'],
  },

  subject: {
    type: String,
    canRead: ['admins'],
  },

  testPath: {
    type: String,
    canRead: ['admins'],
  },

};

export default schema;
