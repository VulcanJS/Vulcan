import Users from 'meteor/vulcan:users';

/*
  Let's create a new "mods" group that can edit and delete any posts
*/

Users.createGroup("mods");

Users.groups.mods.can("posts.edit.all"); // mods can edit anybody's posts
Users.groups.mods.can("posts.remove.all"); // mods can delete anybody's posts