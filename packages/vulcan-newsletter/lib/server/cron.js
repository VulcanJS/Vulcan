import { SyncedCron } from 'meteor/littledata:synced-cron';
import moment from 'moment';
import Newsletters from '../modules/collection.js';
import { getSetting, registerSetting } from 'meteor/vulcan:core';

const defaultFrequency = [1]; // every monday
const defaultTime = '00:00'; // GMT

registerSetting('newsletter.frequency', defaultFrequency, 'Which days to send the newsletter on (1 = Monday, 7 = Sunday)');
registerSetting('newsletter.time', defaultTime, 'Time to send the newsletter on (ex: “16:30”)');
registerSetting('newsletter.enabledInDev', false, 'Enable the newsletter in development');
registerSetting('newsletter.enabled', false, 'Enable the newsletter');

SyncedCron.options = {
  log: true,
  collectionName: 'cronHistory',
  utc: false,
  collectionTTL: 172800
};

const addZero = num => {
  return num < 10 ? '0'+num : num;
};

var getSchedule = function (parser) {
  var frequency = getSetting('newsletter.frequency', defaultFrequency);
  var recur = parser.recur();
  var schedule;

  // Default is once a week (Mondays)
  if (!!frequency) {
    const frequencyArray = Array.isArray(frequency) ? frequency : _.toArray(frequency);
    schedule = recur.on(frequencyArray).dayOfWeek();
  }
  else {
    schedule = recur.on(2).dayOfWeek();
  }

  const offsetInMinutes = new Date().getTimezoneOffset();
  const GMTtime = moment.duration(getSetting('newsletter.time', defaultTime));
  const serverTime = GMTtime.subtract(offsetInMinutes, 'minutes');
  const serverTimeString = addZero(serverTime.hours()) + ':' + addZero(serverTime.minutes());

  // console.log("// scheduled for: (GMT): "+getSetting('newsletterTime', defaultTime));
  // console.log("// server offset (minutes): "+offsetInMinutes);
  // console.log("// server scheduled time (minutes): "+serverTime.asMinutes());
  // console.log("// server scheduled time: "+serverTimeString);

  return schedule.on(serverTimeString).time();
};

Meteor.methods({
  getNextJob: function () {
    var nextJob = SyncedCron.nextScheduledAtDate('scheduleNewsletter');
    console.log(nextJob); // eslint-disable-line
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
      if (process.env.NODE_ENV === 'production' || getSetting('newsletter.enabledInDev', false)) {
        console.log("// Scheduling newsletter…"); // eslint-disable-line
        console.log(new Date()); // eslint-disable-line
        Newsletters.send();
      }
    }
  });
};

Meteor.startup(function () {
  if (getSetting('newsletter.enabled', false)) {
    addJob();
  }
});
