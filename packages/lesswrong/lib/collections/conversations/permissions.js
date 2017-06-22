import Users from 'meteor/vulcan:users';

const membersActions = [
  'conversations.new.own',
  'conversations.edit.own',
  'conversations.remove.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'conversations.new',
  'conversations.edit.all',
  'conversations.remove.all',
];
Users.groups.admins.can(adminActions);
