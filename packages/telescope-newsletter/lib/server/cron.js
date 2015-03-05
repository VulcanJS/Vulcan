SyncedCron.options = {
  log: false,
  collectionName: 'cronHistory',
  utc: false,
  collectionTTL: 172800
}

defaultFrequency = 7; // once a week
defaultTime = '00:00';

var getSchedule = function (parser) {
  var frequency = getSetting('newsletterFrequency', defaultFrequency);
  var recur = parser.recur();
  var schedule;
  switch (frequency) {
    case 1: // every day
      // sched = {schedules: [{dw: [1,2,3,4,5,6,0]}]};
      schedule = recur.on(1,2,3,4,5,6,0).dayOfWeek();

    case 2: // Mondays, Wednesdays, Fridays
      // sched = {schedules: [{dw: [2,4,6]}]};
      schedule = recur.on(2,4,6).dayOfWeek();

    case 3: // Mondays, Thursdays
      // sched = {schedules: [{dw: [2,5]}]};
      schedule = recur.on(2,5).dayOfWeek();

    case 7: // Once a week (Mondays)
      // sched = {schedules: [{dw: [2]}]};
      schedule = recur.on(2).dayOfWeek();

    default: // Once a week (Mondays)
      schedule = recur.on(2).dayOfWeek();
  }
  return schedule.on(getSetting('newsletterTime', defaultTime)).time();
}

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
      scheduleNextCampaign();
    }
  });
}
Meteor.startup(function () {
  if (getSetting('enableNewsletter', false)) {
    addJob();
  }
});