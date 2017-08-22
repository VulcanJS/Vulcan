import schema from './schema.js';
import Users from 'meteor/vulcan:users'
import { getDefaultResolvers, getDefaultMutations, createCollection } from 'meteor/vulcan:core';
/**
 * @summary Initiate LWEvents collection
 * @namespace LWEvents
 */

const options = {

  newCheck: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'events.new.own') : Users.canDo(user, `events.new.all`)
  },

  editCheck: (user, document) => {
    if (!user || !document) return false;
    return Users.canDo(user, `events.edit.all`)
  },

  removeCheck: (user, document) => {
    if (!user || !document) return false;
    return Users.canDo(user, `events.remove.all`)
  },

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
