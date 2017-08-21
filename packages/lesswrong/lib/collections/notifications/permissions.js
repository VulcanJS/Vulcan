import Users from 'meteor/vulcan:users';
import Notifications from './collection.js';

const membersActions = [
  'notifications.new.own',
  'notifications.edit.own',
  'notifications.view.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'notifications.new.all',
  'notifications.edit.all',
  'notifications.remove.all',
];
Users.groups.admins.can(adminActions);

Notifications.checkAccess = (user, document) => {
  if (!user || !document) return false;
  return Users.owns(user, document) ? Users.canDo(user, 'notifications.view.own') : Users.canDo(user, `conversations.view.all`)
    };
