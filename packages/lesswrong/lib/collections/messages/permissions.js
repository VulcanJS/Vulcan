import Users from 'meteor/vulcan:users';

const membersActions = [
  'messages.new.own',
  'messages.edit.own',
  'messages.remove.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'messages.new',
  'messages.edit.all',
  'messages.remove.all',
];
Users.groups.admins.can(adminActions);
