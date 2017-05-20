import Users from 'meteor/vulcan:users';

const membersActions = [
  'rssfeed.new.own',
  'rssfeed.edit.own',
  'rssfeed.remove.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'rssfeed.new',
  'rssfeed.edit.all',
  'rssfeed.remove.all',
];
Users.groups.admins.can(adminActions);
