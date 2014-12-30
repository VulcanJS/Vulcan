Template[getTemplate('currentVersion')].helpers({
  currentVersion: function () {
    return Versions.find({read: false}).fetch()[0];
  }
});

Meteor.startup(function () {
  heroModules.push({
    template: 'currentVersion'
  });
});