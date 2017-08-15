import schema from './schema.js';
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';

/**
 * @summary Telescope Messages namespace
 * @namespace Messages
 */
const RSSFeeds = createCollection({

  collectionName: 'RSSFeeds',

  typeName: 'RSSFeed',

  schema,

  resolvers: getDefaultResolvers('RSSFeeds'),

  mutations: getDefaultMutations('RSSFeeds'),

});

export default RSSFeeds;
