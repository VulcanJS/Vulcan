import schema from './schema.js';
import { createCollection, getDefaultResolvers, getDefaultMutations} from 'meteor/vulcan:core';

/**
 * @summary Telescope Messages namespace
 * @namespace Messages
 */
const Messages = createCollection({

  collectionName: 'Messages',

  typeName: 'Message',

  schema,

  resolvers: getDefaultResolvers('Messages'),

  mutations: getDefaultMutations('Messages'),

});

export default Messages;
