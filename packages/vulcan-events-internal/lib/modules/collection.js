import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';
import Users from 'meteor/vulcan:users';

const Events = createCollection({

  collectionName: 'Events',

  typeName: 'Event',

  schema,

  resolvers: getDefaultResolvers('Events'),

  mutations: getDefaultMutations('Events', {
    newCheck: () => true,
    editCheck: () => false,
    removeCheck: () => false
  })

});

Events.checkAccess = (currentUser, doc) => {
  return Users.isAdmin(currentUser);
}

export default Events;
