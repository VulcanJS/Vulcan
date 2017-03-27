import Users from 'meteor/vulcan:users';

const guestsActions = [
  "posts.view.approved.own",
  "posts.view.approved.all"
];
Users.groups.guests.can(guestsActions);

const membersActions = [
  "posts.view.approved.own",
  "posts.view.approved.all",
  "posts.view.pending.own",
  "posts.view.rejected.own",
  "posts.view.spam.own",
  "posts.view.deleted.own",
  "posts.new", 
  "posts.edit.own", 
  "posts.remove.own",
];
Users.groups.members.can(membersActions);

const adminActions = [
  "posts.view.pending.all",
  "posts.view.rejected.all",
  "posts.view.spam.all",
  "posts.view.deleted.all",
  "posts.new.approved",
  "posts.edit.all",
  "posts.remove.all"
];
Users.groups.admins.can(adminActions);
