import Users from 'meteor/vulcan:users';
import Sequences from './collection.js'

const membersActions = [
  'sequences.edit.own',
  'sequences.new.own',
  'sequences.remove.own',
  'chapters.new.own',
  'chapters.remote.own',
  'chapters.edit.own',
  'sequences.view.own',
];
Users.groups.members.can(membersActions);

const adminActions= [
  'sequences.edit.all',
  'sequences.view.all'
]
Users.groups.admins.can(adminActions);

// Sequences.checkAccess = (user, document) => {
//   console.log("Sequences checkAccess function: ", user, document);
//   if (!user || !document) return false;
//   return Users.owns(user, document) ? Users.canDo(user, 'sequences.view.own') : (Users.canDo(user, `sequences.view.all`) || !document.draft)};
