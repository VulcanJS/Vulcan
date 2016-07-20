import Users from './collection.js';

const defaultActions = [
  "users.edit.own", 
  "users.remove.own"
];
Users.groups.default.can(defaultActions);

const adminActions = [
  "users.edit.all",
  "users.remove.all"
];
Users.groups.admins.can(adminActions);