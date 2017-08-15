import schema from './schema.js';
import { getDefaultResolvers, getDefaultMutations, createCollection } from 'meteor/vulcan:core';

/**
 * @summary Initiate LWEvents collection
 * @namespace LWEvents
 */
const LWEvents = createCollection({

  // collection: Meteor.notifications,

  collectionName: 'LWEvents',

  typeName: 'LWEvent',

  schema,

  resolvers: getDefaultResolvers('LWEvents'),

  mutations: getDefaultMutations('LWEvents'),

});

export default LWEvents;
