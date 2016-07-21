import Users from 'meteor/nova:users';

const anonymousActions = [
  "categories.view.all"
];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
  "categories.view.all"
];
Users.groups.default.can(defaultActions);

const adminActions = [
  "categories.view.all",
  "categories.new",
  "categories.edit.all",
  "categories.remove.all"
];
Users.groups.admins.can(adminActions);
