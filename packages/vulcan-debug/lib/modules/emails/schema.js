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

  path: {
    type: String,
    canRead: ['admins'],
  },

};

export default schema;
