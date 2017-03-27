import Users from 'meteor/vulcan:users';

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
