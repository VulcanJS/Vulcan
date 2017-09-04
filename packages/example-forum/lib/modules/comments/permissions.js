/*

Comments permissions

*/

import Users from 'meteor/vulcan:users';

const guestsActions = [
  'comments.view'
];
Users.groups.guests.can(guestsActions);

const membersActions = [
  'comments.view',
  'comments.new', 
  'comments.edit.own', 
  'comments.remove.own', 
  'comments.upvote', 
  'comments.cancelUpvote', 
  'comments.downvote',
  'comments.cancelDownvote'
];
Users.groups.members.can(membersActions);

const adminActions = [
  'comments.edit.all',
  'comments.remove.all'
];
Users.groups.admins.can(adminActions);