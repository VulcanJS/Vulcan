import Users from 'meteor/nova:users';

const defaultActions = [
  "posts.subscribe",
  "posts.unsubscribe",
  "users.subscribe",
  "users.unsubscribe",
];

Users.groups.default.can(defaultActions);

const adminActions = [
  "posts.subscribe.all",
  "posts.unsubscribe.all",
  "users.subscribe.all",
  "users.unsubscribe.all",
];

Users.groups.admins.can(adminActions);