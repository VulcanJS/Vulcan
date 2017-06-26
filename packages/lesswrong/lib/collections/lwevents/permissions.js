import Users from 'meteor/vulcan:users';

const membersActions = [
  'events.new.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'events.new',
  'events.edit.all',
  'events.remove.all',
  'events.view.all',
];
Users.groups.admins.can(adminActions);
