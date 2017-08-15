import schema from './schema.js';
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';

/**
 * @summary Telescope Notifications namespace
 * @namespace Notifications
 */
const Notifications = createCollection({

  // collection: Meteor.notifications,

  collectionName: 'Notifications',

  typeName: 'Notification',

  schema,

  resolvers: getDefaultResolvers('Notifications'),

  mutations: getDefaultMutations('Notifications'),

});

export default Notifications;
