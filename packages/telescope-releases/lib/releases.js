Releases = new Meteor.Collection('releases');

heroModules.push({
  template: 'currentRelease'
});

preloadSubscriptions.push('currentRelease');

Meteor.startup(function () {
  Releases.allow({
    insert: isAdminById,
    update: isAdminById,
    remove: isAdminById
  });
});
