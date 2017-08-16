import Users from 'meteor/vulcan:users';
import Sequences from './collection.js'

const membersActions = [
  'sequence.edit.own',
  'sequence.text.edit.own',
  'chapter.add.own',
  'chapter.delete.own',
  'chapter.title.edit.own',
  'chapter.subtitle.edit.own',
  'chapter.text.edit.own',
  'post.new.own',
  'post.edit.own',
  'post.remove.own',
];
Users.groups.members.can(membersActions);

const adminActions= [
  'sequence.edit.all',
]
Users.groups.admins.can(adminActions);

Sequences.checkAccess = (user, document) => {
  if (!user || !document) return false;
  return Users.owns(user, document) ? Users.canDo(user, 'conversation.view.own') : (Users.canDo(user, `conversation.view.all`) || !document.draft)
    };
