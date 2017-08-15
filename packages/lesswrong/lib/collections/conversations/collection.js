import schema from './schema.js';
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import './permissions.js';

/**
 * @summary Telescope Conversations namespace
 * @namespace Conversations
 */

const options = {
     checkNew: (user, document) => {
       if (!user || !document) return false;
       return document.participantIds.includes(user._id) ? Users.canDo(user, 'conversation.new.own') : Users.canDo(user, `conversation.new.all`)},

     checkEdit: (user, document) => {
       if (!user || !document) return false;
       return document.participantIds.includes(user._id) ? Users.canDo(user, 'conversation.edit.own') : Users.canDo(user, `conversation.edit.all`)
     },

     checkRemove: (user, document) => {
       if (!user || !document) return false;
       return document.participantIds.includes(user._id) ? Users.canDo(user, 'conversation.remove.own') : Users.canDo(user, `conversation.remove.all`)
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
