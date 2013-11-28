Searches = new Meteor.Collection('searches');

Searches.allow({
  update: isAdminById
, remove: isAdminById
});

