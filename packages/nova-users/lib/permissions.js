import Users from './collection.js';

const defaultActions = [
  "users.new", 
  "users.edit.own", 
  "users.remove.own"
];
Users.groups.default.can(defaultActions);

const adminActions = [
  "users.new", 
  "users.edit.all",
  "users.remove.all",
  "settings.edit"
];
Users.groups.admins.can(adminActions);