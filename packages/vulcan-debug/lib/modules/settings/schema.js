const schema = {

  name: {
    label: 'Name',
    type: String,
    viewableBy: ['admins'],
  },

  value: {
    label: 'Value',
    type: Object,
    viewableBy: ['admins'],
  },

  defaultValue: {
    label: 'Default Value',
    type: Object,
    viewableBy: ['admins'],
  },

  public: {
    label: 'Public',
    type: Boolean,
    viewableBy: ['admins'],
  },

  description: {
    label: 'Description',
    type: String,
    viewableBy: ['admins'],
  },

};

export default schema;
