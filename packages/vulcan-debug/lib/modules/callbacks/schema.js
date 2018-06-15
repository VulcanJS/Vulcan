import { Callbacks } from 'meteor/vulcan:lib';

const schema = {
  name: {
    type: String,
    viewableBy: ['admins'],
  },

  iterator: {
    type: Object,
    viewableBy: ['admins'],
  },

  properties: {
    type: Array,
    viewableBy: ['admins'],
  },

  'properties.$': {
    type: Object,
    viewableBy: ['admins'],
  },

  // iterator: {
  //   label: 'Iterator',
  //   type: String,
  //   viewableBy: ['admins'],
  // },

  // options: {
  //   label: 'Options',
  //   type: Array,
  //   viewableBy: ['admins'],
  // },

  // 'options.$': {
  //   type: Object,
  //   viewableBy: ['admins'],
  // },

  runs: {
    type: String,
    viewableBy: ['admins'],
  },

  newSyntax: {
    label: 'New Syntax',
    type: Boolean,
    viewableBy: ['admins'],
  },

  returns: {
    label: 'Should Return',
    type: String,
    viewableBy: ['admins'],
  },

  description: {
    type: String,
    viewableBy: ['admins'],
  },

  hooks: {
    type: Array,
    viewableBy: ['admins'],
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
