import Users from 'meteor/nova:users';

const anonymousActions = [
  "comments.view"
];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
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