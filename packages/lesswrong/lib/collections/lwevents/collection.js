import schema from './schema.js';
import { getDefaultResolvers, getDefaultMutations, createCollection } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
/**
 * @summary Initiate LWEvents collection
 * @namespace LWEvents
 */

 const options = {
   newCheck: (user, document) => {
     if (!user || !document) return false;
     return Users.owns(user, document) ? Users.canDo(user, 'events.new') : Users.canDo(user, 'events.new')
   }
 }
const LWEvents = createCollection({

  // collection: Meteor.notifications,

  collectionName: 'LWEvents',

  typeName: 'LWEvent',

  schema,

  resolvers: getDefaultResolvers('LWEvents'),

  mutations: getDefaultMutations('LWEvents', options),

});

export default LWEvents;
