/*

Declare permissions for the comments collection.

*/

import Users from 'meteor/vulcan:users';

const membersActions = [
  'pics.new',
  'pics.edit.own',
  'pics.remove.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'pics.edit.all',
  'pics.remove.all'
];
Users.groups.admins.can(adminActions);
