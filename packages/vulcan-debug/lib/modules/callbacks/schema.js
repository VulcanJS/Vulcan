import { Callbacks } from 'meteor/vulcan:lib';
import { readPermissions } from "../permissions";

const schema = {
  name: {
    type: String,
    canRead: readPermissions,
  },

  iterator: {
    type: Object,
    canRead: readPermissions,
  },

  properties: {
    type: Array,
    canRead: readPermissions,
  },

  'properties.$': {
    type: Object,
    canRead: readPermissions,
  },

  // iterator: {
  //   label: 'Iterator',
  //   type: String,
  //   canRead: readPermissions,
  // },

  // options: {
  //   label: 'Options',
  //   type: Array,
  //   canRead: readPermissions,
  // },

  // 'options.$': {
  //   type: Object,
  //   canRead: readPermissions,
  // },

  runs: {
    type: String,
    canRead: readPermissions,
  },

  newSyntax: {
    label: 'New Syntax',
    type: Boolean,
    canRead: readPermissions,
  },

  returns: {
    label: 'Should Return',
    type: String,
    canRead: readPermissions,
  },

  description: {
    type: String,
    canRead: readPermissions,
  },

  hooks: {
    type: Array,
    canRead: readPermissions,
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
