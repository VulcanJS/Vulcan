import Users from 'meteor/vulcan:users';

const membersActions = [
  'notifications.new.own',
  'notifications.edit.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'notifications.new',
  'notifications.edit.all',
  'notifications.remove.all',
];
Users.groups.admins.can(adminActions);
