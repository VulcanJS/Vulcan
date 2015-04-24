Releases = new Meteor.Collection('releases');

Telescope.modules.register("hero", {
  template: 'currentRelease'
});

Telescope.subscriptions.preload('currentRelease');

Meteor.startup(function () {
  Releases.allow({
    insert: Users.isAdminById,
    update: Users.isAdminById,
    remove: Users.isAdminById
  });
});
