import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
import { createCollection } from 'meteor/vulcan:core';

/**
 * @summary Telescope Notifications namespace
 * @namespace Notifications
 */
const Notifications = createCollection({

  // collection: Meteor.notifications,

  collectionName: 'Notifications',

  typeName: 'Notification',

  schema,

  resolvers,

  mutations,

});

export default Notifications;
