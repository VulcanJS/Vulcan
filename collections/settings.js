Settings = new Meteor.Collection('settings');

Settings.allow({
  insert: isAdminById
, update: isAdminById
, remove: isAdminById
});

