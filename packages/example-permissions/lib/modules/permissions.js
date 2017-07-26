/*

User groups:

1. Guests
2. Members
3. Photographers (custom)
4. Mods (custom)
5. Managers (custom)
6. Admins

Guests can:

- Do nothing

Members can:

- Submit new comments
- Edit their own comments

Photographers can:

- Do everything a member can
- Submit new photos
- Edit their own photos

Mods can:

- Do everything a member can
- View deleted comments
- Edit other user's comments

Managers can:

- Do everything a member can
- View/insert/edit the isDeleted field (see Pics schema)

Admins can:

- Do everything

*/

import Users from 'meteor/vulcan:users';

/*

Create new custom groups

*/

Users.createGroup('photographers');
Users.createGroup('mods');
Users.createGroup('managers');

/*

Declare new/edit/remove permissions for the comments collection.

*/

Users.groups.members.can([
  'comments.new',
  'comments.edit.own',
  'comments.remove.own',
]);

Users.groups.mods.can([
  'comments.view.deleted',
  'comments.edit.all',
  'comments.remove.all'
]);

/*

Declare new/edit/remove permissions for the pics collection.

*/

Users.groups.photographers.can([
  'pics.new',
  'pics.edit.own',
  'pics.remove.own',
]);

