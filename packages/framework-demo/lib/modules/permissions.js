import Users from 'meteor/nova:users';

const guestsActions = [
  'movies.view.own',
  'movies.view.all',
];
Users.groups.guests.can(membersActions);

const membersActions = [
  'movies.new',
  'movies.edit.own',
  'movies.remove.own',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'movies.edit.all',
  'movies.remove.all'
];
Users.groups.admins.can(adminActions);
