import Campaign from "./campaign.js";

SyncedCron.options = {
  log: false,
  collectionName: 'cronHistory',
  utc: false,
  collectionTTL: 172800
};

var defaultFrequency = 7; // once a week
var defaultTime = '00:00';

var getSchedule = function (parser) {
  var frequency = Telescope.settings.get('newsletterFrequency', defaultFrequency);
  var recur = parser.recur();
  var schedule;

  // Default is once a week (Mondays)
  if (!!frequency) {
    schedule = recur.on(frequency).dayOfWeek();
  }
  else {
    schedule = recur.on(2).dayOfWeek();
  }

  return schedule.on(Telescope.settings.get('newsletterTime', defaultTime)).time();
};

Meteor.methods({
  getNextJob: function () {
    var nextJob = SyncedCron.nextScheduledAtDate('scheduleNewsletter');
    console.log(nextJob);
    return nextJob;
  }
});

var addJob = function () {
  SyncedCron.add({
    name: 'scheduleNewsletter',
    schedule: function(parser) {
      // parser is a later.parse object
      return getSchedule(parser);
    },
    job: function() {
      // only schedule newsletter campaigns in production
      if (process.env.NODE_ENV === "production") {
        Campaign.scheduleNextWithMailChimp();
      }
    }
  });
};

Meteor.startup(function () {
  if (Telescope.settings.get('enableNewsletter', true) && Telescope.settings.get('mailChimpAPIKey') && Telescope.settings.get('mailChimpListId')) {
    addJob();
  }
});
