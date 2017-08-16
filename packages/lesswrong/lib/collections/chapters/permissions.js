import Users from 'meteor/vulcan:users';
import Chapters from './collection.js';

const membersActions = [
  "chapter.view.own",
  "chapter.new.own",
  "chapter.edit.own",
  "chapter.remove.own",
];
Users.groups.members.can(membersActions);

const adminActions = [
  "chapter.view.all",
  "chapter.new.all",
  "chapter.edit.all",
  "chapter.remove.all",
];
Users.groups.admins.can(adminActions);

Chapters.checkAccess = (user, document) => {
  if (!user || !document) return false;
  return Users.owns(user, document) ? Users.canDo(user, 'chapter.view.own') : (Users.canDo(user, `conversation.view.all`) || !document.draft)
};
