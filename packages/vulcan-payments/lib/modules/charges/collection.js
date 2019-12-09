// The main Charges collection definition file.
import { createCollection, getDefaultResolvers } from 'meteor/vulcan:core';
import schema from './schema.js';
import Users from 'meteor/vulcan:users';

const Charges = createCollection({
  collectionName: 'Charges',

  typeName: 'Charge',

  schema,

  resolvers: getDefaultResolvers('Charges'),

  mutations: null,

  defaultInput: {
    sort: {
      createdAt: 'desc',
    },
  },
});

Charges.addDefaultView(terms => {
  return {
    options: { sort: { createdAt: -1 } },
  };
});

Charges.checkAccess = (currentUser, charge) => {
  return Users.isAdmin(currentUser);
};

export default Charges;
