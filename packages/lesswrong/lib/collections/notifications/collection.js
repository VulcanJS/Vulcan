import schema from './schema.js';
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

/**
 * @summary Telescope Notifications namespace
 * @namespace Notifications
 */

const options = {
  newCheck: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'notifications.new.own') : Users.canDo(user, `notifications.new.all`)
  },

  editCheck: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'notifications.edit.own') : Users.canDo(user, `notifications.edit.all`)
  },

  removeCheck: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'notifications.remove.own') : Users.canDo(user, `notifications.remove.all`)
  }
}

const Notifications = createCollection({

  // collection: Meteor.notifications,

  collectionName: 'Notifications',

  typeName: 'Notification',

  schema,

  resolvers: getDefaultResolvers('Notifications'),

  mutations: getDefaultMutations('Notifications', options),

});

export default Notifications;
