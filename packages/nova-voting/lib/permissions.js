import Users from 'meteor/nova:users';

const membersActions = [
  "posts.upvote", 
  "posts.cancelUpvote", 
  "posts.downvote",
  "posts.cancelDownvote",
  "comments.upvote", 
  "comments.cancelUpvote", 
  "comments.downvote",
  "comments.cancelDownvote"
];
Users.groups.members.can(membersActions);
