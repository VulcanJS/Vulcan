import Users from 'meteor/vulcan:users';
import Messages from './collection.js';
import Conversations from '../conversations/collection.js'

const membersActions = [
  'messages.new.own',
  'messages.edit.own',
  'messages.remove.own',
  'messages.view.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'messages.new.all',
  'messages.edit.all',
  'messages.remove.all',
  'messages.view.all',
];
Users.groups.admins.can(adminActions);

Messages.checkAccess = (user, document) => {
  if (!user || !document) return false;
  return Conversations.findOne({_id: document.conversationId}).participantIds.includes(user._id) ?
    Users.canDo(user, 'messages.view.own') : Users.canDo(user, `messages.view.all`)
};
