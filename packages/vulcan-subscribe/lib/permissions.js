import Users from 'meteor/vulcan:users';

const membersActions = [
  "posts.subscribe",
  "posts.unsubscribe",
  "users.subscribe",
  "users.unsubscribe",
  "categories.subscribe",
  "categories.unsubscribe",
];

Users.groups.members.can(membersActions);
