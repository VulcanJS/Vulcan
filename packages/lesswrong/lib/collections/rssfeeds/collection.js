import schema from './schema.js';
import resolvers from './resolvers.js';
import mutations from './mutations.js';
import { createCollection } from 'meteor/vulcan:core';

/**
 * @summary Telescope Messages namespace
 * @namespace Messages
 */
const RSSFeeds = createCollection({

  collectionName: 'RSSFeeds',

  typeName: 'RSSFeed',

  schema,

  resolvers,

  mutations,

});

export default RSSFeeds;
