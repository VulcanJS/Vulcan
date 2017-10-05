/*

Posts permissions

*/

import Users from 'meteor/vulcan:users';

const guestsActions = [
  'posts.view.approved'
];
Users.groups.guests.can(guestsActions);

const membersActions = [
  'posts.new', 
  'posts.edit.own', 
  'posts.remove.own',
  'posts.upvote', 
  'posts.downvote',
];
Users.groups.members.can(membersActions);

const adminActions = [
  'posts.view.pending',
  'posts.view.rejected',
  'posts.view.spam',
  'posts.view.deleted',
  'posts.new.approved',
  'posts.edit.all',
  'posts.remove.all'
];
Users.groups.admins.can(adminActions);