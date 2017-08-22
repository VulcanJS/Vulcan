import Users from 'meteor/vulcan:users';

const adminActions = [
  'collection.new',
  'collection.edit',
  'collection.remove'
];

Users.groups.admins.can(adminActions);

const memberActions = [
  'collection.edit.own',
];

Users.groups.members.can(memberActions);
