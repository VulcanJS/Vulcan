import Users from 'meteor/vulcan:users';
import Conversations from './collection.js'

const membersActions = [
  'conversations.new.own',
  'conversations.edit.own',
  'conversations.remove.own',
  'conversations.view.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'conversations.new.all',
  'conversations.edit.all',
  'conversations.remove.all',
  'conversations.view.all',
];
Users.groups.admins.can(adminActions);

Conversations.checkAccess = (user, document) => {
  if (!user || !document) return false;
  return document.participantIds.includes(user._id) ? Users.canDo(user, 'conversations.view.own') : Users.canDo(user, `conversations.view.all`)
    };
