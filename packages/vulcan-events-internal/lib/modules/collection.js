import { createCollection, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';
import Users from 'meteor/vulcan:users';

const Events = createCollection({
  collectionName: 'AnalyticsEvents',

  typeName: 'AnalyticsEvent',

  schema,

  mutations: getDefaultMutations('AnalyticsEvents', {
    newCheck: () => true,
    update: false,
    upsert: false,
    delete: false,
  }),

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
