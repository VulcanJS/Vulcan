import Newsletter from '../namespace.js';
import moment from 'moment';

SyncedCron.options = {
  log: true,
  collectionName: 'cronHistory',
  utc: false,
  collectionTTL: 172800
};

const addZero = num => {
  return num < 10 ? "0"+num : num;
};

var defaultFrequency = 7; // once a week
var defaultTime = '00:00'; // GMT

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

  const offsetInMinutes = new Date().getTimezoneOffset();
  const GMTtime = moment.duration(Telescope.settings.get('newsletterTime', defaultTime));
  const serverTime = GMTtime.subtract(offsetInMinutes, "minutes");
  const serverTimeString = addZero(serverTime.hours()) + ":" + addZero(serverTime.minutes());

  console.log("// scheduled for: (GMT): "+Telescope.settings.get('newsletterTime', defaultTime));
  console.log("// server offset (minutes): "+offsetInMinutes);
  console.log("// server scheduled time (minutes): "+serverTime.asMinutes());
  console.log("// server scheduled time: "+serverTimeString);

  return schedule.on(serverTimeString).time();
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
      if (process.env.NODE_ENV === "production" || Telescope.settings.get("enableNewsletterInDev", false)) {
        console.log("// Scheduling newsletter…")
        console.log(new Date());
        Newsletter.scheduleNextWithMailChimp();
      }
    }
  });
};

Meteor.startup(function () {
  if (Telescope.settings.get('enableNewsletter', true) && Telescope.settings.get('mailChimpAPIKey') && Telescope.settings.get('mailChimpListId')) {
    addJob();
  }
});
