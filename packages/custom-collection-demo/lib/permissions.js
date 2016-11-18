import Users from 'meteor/nova:users';

const defaultActions = [
  "movies.new",
  "movies.edit.own",
  "movies.remove.own",
];
Users.groups.default.can(defaultActions);

const adminActions = [
  "movies.edit.all",
  "movies.remove.all"
];
Users.groups.admins.can(adminActions);
