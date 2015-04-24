Releases = new Meteor.Collection('releases');

Telescope.modules.register("hero", {
  template: 'currentRelease'
});

Telescope.config.preloadSubscriptions.push('currentRelease');

Meteor.startup(function () {
  Releases.allow({
    insert: Users.isAdminById,
    update: Users.isAdminById,
    remove: Users.isAdminById
  });
});
