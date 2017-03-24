import Users from 'meteor/vulcan:users';

const guestsActions = [
  "categories.view.all"
];
Users.groups.guests.can(guestsActions);

const membersActions = [
  "categories.view.all"
];
Users.groups.members.can(membersActions);

const adminActions = [
  "categories.view.all",
  "categories.new",
  "categories.edit.all",
  "categories.remove.all"
];
Users.groups.admins.can(adminActions);
