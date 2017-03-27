import { MessageSchema, ConversationSchema } from './schema.js';
import { MessageResolvers, ConversationResolvers } from './resolvers.js';
import { MessageMutations, ConversationMutations}  from './mutations.js';


// TODO: is the following comment true in our case?
import { createCollection } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet

/**
 * @summary Telescope Conversations namespace
 * @namespace Conversations
 */
const Conversations = createCollection({

  collectionName: 'conversations',

  typeName: 'Conversation',

  schema: ConversationSchema,

  resolvers: ConversationResolvers,

  mutations: ConversationMutations,

});


/**
 * @summary Telescope Messages namespace
 * @namespace Messages
 */
const Messages = createCollection({

  collectionName: 'messages',

  typeName: 'Message',

  schema: MessageSchema,

  resolvers: MessageResolvers,

  mutations: MessageMutations,

});

export {Messages, Conversations};

// Conversations,
