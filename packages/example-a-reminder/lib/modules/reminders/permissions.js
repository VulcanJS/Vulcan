import Users from 'meteor/vulcan:users';

const membersActions = [
  'reminders.new',
  'reminders.edit.own',
  'reminders.remove.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'reminders.edit.all',
  'reminders.remove.all'
];
Users.groups.admins.can(adminActions);
