const schema = {

  name: {
    label: 'Name',
    type: String,
    canRead: ['admins'],
  },

  value: {
    label: 'Value',
    type: Object,
    canRead: ['admins'],
  },

  defaultValue: {
    label: 'Default Value',
    type: Object,
    canRead: ['admins'],
  },

  isPublic: {
    label: 'Public',
    type: Boolean,
    canRead: ['admins'],
  },

  description: {
    label: 'Description',
    type: String,
    canRead: ['admins'],
  },

};

export default schema;
