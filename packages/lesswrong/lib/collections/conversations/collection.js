import Users from 'meteor/vulcan:users';
import schema from './schema.js';
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import './permissions.js';

/**
 * @summary Telescope Conversations namespace
 * @namespace Conversations
 */

const options = {
     newCheck: (user, document) => {
       if (!user || !document) return false;
       return document.participantIds.includes(user._id) ? Users.canDo(user, 'conversations.new.own')
        : Users.canDo(user, `conversations.new.all`)
     },

     editCheck: (user, document) => {
       if (!user || !document) return false;
       return document.participantIds.includes(user._id) ? Users.canDo(user, 'conversations.edit.own')
       : Users.canDo(user, `conversations.edit.all`)
     },

     removeCheck: (user, document) => {
       if (!user || !document) return false;
       return document.participantIds.includes(user._id) ? Users.canDo(user, 'conversations.remove.own')
       : Users.canDo(user, `conversations.remove.all`)
     },
 }

const Conversations = createCollection({

  collectionName: 'Conversations',

  typeName: 'Conversation',

  schema,

  resolvers: getDefaultResolvers('Conversations'),

  mutations: getDefaultMutations('Conversations', options)

});

export default Conversations;

// Conversations,
