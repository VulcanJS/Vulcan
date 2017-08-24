import Users from 'meteor/vulcan:users';

const adminActions = [
  'collections.new.all',
  'collections.edit.all',
  'collections.remove.all'
];

Users.groups.admins.can(adminActions);

const memberActions = [
  'collections.edit.own',
];

Users.groups.members.can(memberActions);
