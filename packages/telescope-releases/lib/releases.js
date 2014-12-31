Releases = new Meteor.Collection('releases');

heroModules.push({
  template: 'currentRelease'
});

preloadSubscriptions.push('currentRelease');