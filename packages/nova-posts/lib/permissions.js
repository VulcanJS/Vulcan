import Users from 'meteor/nova:users';

const anonymousActions = [
  "posts.view"
];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
  "posts.view",
  "posts.new", 
  "posts.edit.own", 
  "posts.remove.own", 
  "posts.upvote", 
  "posts.cancelUpvote", 
  "posts.downvote",
  "posts.cancelDownvote"
];
Users.groups.default.can(defaultActions);

const adminActions = [
  "posts.new.approved",
  "posts.edit.all",
  "posts.remove.all"
];
Users.groups.admins.can(adminActions);