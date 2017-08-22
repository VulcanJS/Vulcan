import Users from 'meteor/vulcan:users';
import schema from './schema.js';
import './permissions.js'
import { createCollection, getDefaultResolvers, getDefaultMutations} from 'meteor/vulcan:core';
import Conversations from '../conversations/collection.js'

/**
 * @summary Telescope Messages namespace
 * @namespace Messages
 */

const options = {
  newCheck: (user, document) => {
    if (!user || !document) return false;
    return Conversations.findOne({_id: document.conversationId}).participantIds.includes(user._id) ?
      Users.canDo(user, 'messages.new.own') : Users.canDo(user, `messages.new.all`)
  },

  editCheck: (user, document) => {
    if (!user || !document) return false;
    return Conversations.findOne({_id: document.conversationId}).participantIds.includes(user._id) ?
    Users.canDo(user, 'messages.edit.own') : Users.canDo(user, `messages.edit.all`)
  },

  removeCheck: (user, document) => {
    if (!user || !document) return false;
    return Conversations.findOne({_id: document.conversationId}).participantIds.includes(user._id) ?
    Users.canDo(user, 'messages.remove.own') : Users.canDo(user, `messages.remove.all`)
  },
}

const Messages = createCollection({

  collectionName: 'Messages',

  typeName: 'Message',

  schema,

  resolvers: getDefaultResolvers('Messages'),

  mutations: getDefaultMutations('Messages', options),

});

export default Messages;
