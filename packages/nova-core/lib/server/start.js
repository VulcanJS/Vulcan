Meteor.startup(function () {
  Events.log({
    name: "firstRun",
    unique: true, // will only get logged a single time
    important: true
  });
});

if (Telescope.settings.get('mailUrl')) {
  process.env.MAIL_URL = Telescope.settings.get('mailUrl');
}

Meteor.startup(function() {
  if (typeof SyncedCron !== "undefined") {
    SyncedCron.start();
  }
});
