import Users from 'meteor/nova:users';

const anonymousActions = [
  "comments.view.own",
  "comments.view.all"
];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
  "comments.view.own",
  "comments.view.all",
  "comments.new", 
  "comments.edit.own", 
  "comments.remove.own", 
  "comments.upvote", 
  "comments.cancelUpvote", 
  "comments.downvote",
  "comments.cancelDownvote"
];
Users.groups.default.can(defaultActions);

const adminActions = [
  "comments.edit.all",
  "comments.remove.all"
];
Users.groups.admins.can(adminActions);