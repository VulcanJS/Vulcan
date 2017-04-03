import schema from './schema.js';
import resolvers from './resolvers.js';
import mutations  from './mutations.js';
import { createCollection } from 'meteor/vulcan:core';

/**
 * @summary Telescope Conversations namespace
 * @namespace Conversations
 */
const Conversations = createCollection({

  collectionName: 'conversations',

  typeName: 'Conversation',

  schema,

  resolvers,

  mutations,

});

export default Conversations;

// Conversations,
