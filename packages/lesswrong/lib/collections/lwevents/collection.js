import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
import { createCollection } from 'meteor/vulcan:core';

/**
 * @summary Initiate LWEvents collection
 * @namespace LWEvents
 */
const LWEvents = createCollection({

  // collection: Meteor.notifications,

  collectionName: 'LWEvents',

  typeName: 'LWEvent',

  schema,

  resolvers,

  mutations,

});

export default LWEvents;
