import Users from 'meteor/vulcan:users';
import Chapters from './collection.js';

const membersActions = [
  "chapters.view.own",
  "chapters.new.own",
  "chapters.edit.own",
  "chapters.remove.own",
];
Users.groups.members.can(membersActions);

const adminActions = [
  "chapters.view.all",
  "chapters.new.all",
  "chapters.edit.all",
  "chapters.remove.all",
];
Users.groups.admins.can(adminActions);

Chapters.checkAccess = (user, document) => {
  if (!user || !document) return false;
  return Users.owns(user, document) ? Users.canDo(user, 'chapters.view.own') : (Users.canDo(user, `conversations.view.all`) || !document.draft)
};
