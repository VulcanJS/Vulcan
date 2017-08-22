import Users from 'meteor/vulcan:users';
import LWevents from './collection.js';

const membersActions = [
  'events.new',
  'events.view',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'events.new',
  'events.edit.all',
  'events.remove.all',
  'events.view.all',
];
Users.groups.admins.can(adminActions);

LWevents.checkAccess = (user, document) => {
  if (!user || !document) return false;
  return Users.owns(user, document) ? Users.canDo(user, 'events.view.own') : Users.canDo(user, `events.view.all`)
    };
