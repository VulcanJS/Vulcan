/*

Categories permissions

*/

import Users from 'meteor/vulcan:users';

const guestsActions = [
  'categories.view'
];
Users.groups.guests.can(guestsActions);

const membersActions = [
  'categories.view'
];
Users.groups.members.can(membersActions);

const adminActions = [
  'categories.view',
  'categories.new',
  'categories.edit.all',
  'categories.remove.all'
];
Users.groups.admins.can(adminActions);
