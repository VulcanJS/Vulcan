import { Callbacks } from 'meteor/vulcan:lib';

const schema = {
  name: {
    label: 'Name',
    type: String,
    viewableBy: ['admins'],
  },

  arguments: {
    label: 'Arguments',
    type: Array,
    viewableBy: ['admins'],
  },

  'arguments.$': {
    type: Object,
    viewableBy: ['admins'],
  },

  runs: {
    label: 'Runs',
    type: String,
    viewableBy: ['admins'],
  },

  returns: {
    label: 'Should Return',
    type: String,
    viewableBy: ['admins'],
  },

  description: {
    label: 'Description',
    type: String,
    viewableBy: ['admins'],
  },

  hooks: {
    label: 'Hooks',
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
};

export default schema;
