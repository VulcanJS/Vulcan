import Users from 'meteor/vulcan:users';

const membersActions = [
  'categories.new',
  'categories.edit.own',
  'categories.remove.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'categories.edit.all',
  'categories.remove.all'
];
Users.groups.admins.can(adminActions);
