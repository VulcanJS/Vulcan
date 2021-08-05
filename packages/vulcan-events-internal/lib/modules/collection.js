import { createCollection, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';
import Users from 'meteor/vulcan:users';

const Events = createCollection({
  collectionName: 'AnalyticsEvents',

  typeName: 'AnalyticsEvent',

  schema,

  mutations: {
    update: null,
    upsert: null,
    delete: null
  },

  permissions: {
    canRead: ({ user: currentUser }) => {
      return Users.isAdmin(currentUser);
    },
    canCreate: ['guests'],
    canUpdate: () => false,
    canDelete: () => false,
  },
});

export default Events;
