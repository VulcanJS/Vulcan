import Users from 'meteor/vulcan:users';
import LWevents from './collection.js';

const membersActions = [
  'events.new.own',
  'events.view.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'events.new',
  'events.edit.all',
  'events.remove.all',
  'events.view.all',
];
Users.groups.admins.can(adminActions);
