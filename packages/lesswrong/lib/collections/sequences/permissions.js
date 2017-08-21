import Users from 'meteor/vulcan:users';
import Sequences from './collection.js'

const membersActions = [
  'sequences.edit.own',
  'sequences.text.edit.own',
  'chapters.add.own',
  'chapters.edit.own',
  'chapters.remove.own',
  'posts.new.own',
  'posts.edit.own',
  'posts.remove.own',
];
Users.groups.members.can(membersActions);

const adminActions= [
  'sequences.edit.all',
]
Users.groups.admins.can(adminActions);

Sequences.checkAccess = (user, document) => {
  if (!user || !document) return false;
  return Users.owns(user, document) ? Users.canDo(user, 'conversations.view.own') : (Users.canDo(user, `conversations.view.all`) || !document.draft)
    };
