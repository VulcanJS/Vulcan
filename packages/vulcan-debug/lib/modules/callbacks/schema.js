import { Callbacks } from 'meteor/vulcan:lib';

const schema = {
  name: {
    type: String,
    canRead: ['admins'],
  },

  iterator: {
    type: Object,
    canRead: ['admins'],
  },

  properties: {
    type: Array,
    canRead: ['admins'],
  },

  'properties.$': {
    type: Object,
    canRead: ['admins'],
  },

  // iterator: {
  //   label: 'Iterator',
  //   type: String,
  //   canRead: ['admins'],
  // },

  // options: {
  //   label: 'Options',
  //   type: Array,
  //   canRead: ['admins'],
  // },

  // 'options.$': {
  //   type: Object,
  //   canRead: ['admins'],
  // },

  runs: {
    type: String,
    canRead: ['admins'],
  },

  newSyntax: {
    label: 'New Syntax',
    type: Boolean,
    canRead: ['admins'],
  },

  returns: {
    label: 'Should Return',
    type: String,
    canRead: ['admins'],
  },

  description: {
    type: String,
    canRead: ['admins'],
  },

  hooks: {
    type: Array,
    canRead: ['admins'],
    resolveAs: {
      type: '[String]',
      resolver: callback => {
        if (Callbacks[callback.name]) {
          const callbacks = Callbacks[callback.name].map(f => f.name);
          return callbacks;
        } else {
          return [];
        }
      },
    },
  },
  
  'hooks.$': {
    type: Object,
  }
};

export default schema;
