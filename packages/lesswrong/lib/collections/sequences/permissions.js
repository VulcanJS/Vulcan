import Users from 'meteor/vulcan:users';

const membersActions = [
  'sequence.edit.own',
  'sequence.new.own',
  'sequence.delete.own',
  'chapter.new.own',
  'chapter.delete.own',
  'chapter.edit.own',
];
Users.groups.members.can(membersActions);
