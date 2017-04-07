/*

Declare permissions for the comments collection.

*/

import Users from 'meteor/vulcan:users';

const membersActions = [
  'comments.new',
  'comments.edit.own',
  'comments.remove.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'comments.edit.all',
  'comments.remove.all'
];
Users.groups.admins.can(adminActions);
