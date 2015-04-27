Releases = new Meteor.Collection('releases');

Telescope.modules.register("hero", {
  template: 'currentRelease'
});

Telescope.subscriptions.preload('currentRelease');

Meteor.startup(function () {
  Releases.allow({
    insert: Users.is.adminById,
    update: Users.is.adminById,
    remove: Users.is.adminById
  });
});
