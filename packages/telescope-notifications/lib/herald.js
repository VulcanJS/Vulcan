// send emails every second when in dev environment
if (Meteor.absoluteUrl().indexOf('localhost') !== -1)
  Herald.settings.queueTimer = 1000;

Meteor.startup(function () {

  Herald.collection.deny({
    update: !Users.can.editById,
    remove: !Users.can.editById
  });

  // disable all email notifications when "emailNotifications" is set to false
  Herald.settings.overrides.email = !Settings.get('emailNotifications', true);

});
