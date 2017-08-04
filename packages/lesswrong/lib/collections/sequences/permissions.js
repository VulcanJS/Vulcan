import Users from 'meteor/vulcan:users';

const membersActions = [
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
