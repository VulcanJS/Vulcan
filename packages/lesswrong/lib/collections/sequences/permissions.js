import Users from 'meteor/vulcan:users';
import Sequences from './collection.js'

const membersActions = [
  'sequence.edit.own',
  'sequence.new.own',
  'sequence.remove.own',
  'chapter.new.own',
  'chapter.remote.own',
  'chapter.edit.own',
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
