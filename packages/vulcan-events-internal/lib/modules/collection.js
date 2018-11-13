import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';
import Users from 'meteor/vulcan:users';

const Events = createCollection({

  collectionName: 'AnalyticsEvents',

  typeName: 'AnalyticsEvent',

  schema,

  resolvers: getDefaultResolvers('AnalyticsEvents'),

  mutations: getDefaultMutations('AnalyticsEvents', {
    newCheck: () => true,
    update: false,
    upsert: false,
    delete: false,
  })

});

Events.checkAccess = (currentUser, doc) => {
  return Users.isAdmin(currentUser);
}

export default Events;
