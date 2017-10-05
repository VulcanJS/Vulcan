/*

Posts permissions

*/

import Users from 'meteor/vulcan:users';

const membersActions = [
  'movies.new', 
  'movies.edit.own', 
  'movies.remove.own',
  'movies.laughing',
  'movies.happy',
  'movies.angry',
  'movies.sad',
];
Users.groups.members.can(membersActions);
