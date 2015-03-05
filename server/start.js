Meteor.startup(function () {
  logEvent({
    name: "firstRun",
    unique: true, // will only get logged a single time 
    important: true
  })
});

if (getSetting('mailUrl'))
  process.env.MAIL_URL = getSetting('mailUrl');
