import Users from 'meteor/nova:users';

const defaultActions = [
  "posts.subscribe",
  "posts.unsubscribe",
  "users.subscribe",
  "users.unsubscribe",
  "categories.subscribe",
  "categories.unsubscribe",
];

Users.groups.default.can(defaultActions);

const adminActions = [
  "posts.subscribe.all",
  "posts.unsubscribe.all",
  "users.subscribe.all",
  "users.unsubscribe.all",
  "categories.subscribe.all",
  "categories.unsubscribe.all",
];

Users.groups.admins.can(adminActions);
