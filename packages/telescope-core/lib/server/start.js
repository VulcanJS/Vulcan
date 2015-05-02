Meteor.startup(function () {
  Events.log({
    name: "firstRun",
    unique: true, // will only get logged a single time
    important: true
  });
});

if (Settings.get('mailUrl'))
  process.env.MAIL_URL = Settings.get('mailUrl');

Meteor.startup(function() {
  SyncedCron.start();
});
