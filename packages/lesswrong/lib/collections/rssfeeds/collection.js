import schema from './schema.js';
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

/**
 * @summary Telescope Messages namespace
 * @namespace Messages
 */

const options = {

    newCheck: (user, document) => {
      if (!document || !user) return false;
      return Users.canDo(user, 'rssfeeds.new.all')
    },

    editCheck: (user, document) => {
      if (!document || !user) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'rssfeeds.edit.own')
        : Users.canDo(user, 'rssfeeds.edit.all')
    },

    removeCheck: (user, document) => {
      if (!document || !user) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'rssfeeds.remove.own')
        : Users.canDo(user, 'rssfeeds.edit.all')
    }
}

const RSSFeeds = createCollection({

  collectionName: 'RSSFeeds',

  typeName: 'RSSFeed',

  schema,

  resolvers: getDefaultResolvers('RSSFeeds'),

  mutations: getDefaultMutations('RSSFeeds', options),

});

export default RSSFeeds;
