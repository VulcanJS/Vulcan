SyncedCron.add({
  name: 'Schedule digest newsletter.',
  schedule: function(parser) {
    // parser is a later.parse object
    var frequency = getSetting('newsletterFrequency', defaultFrequency);
    var interval = 'days';
    return parser.text('every '+frequency+' '+interval);
  }, 
  job: function() {
    scheduleNextCampaign();
  }
});

Meteor.startup(function() {
  if(getSetting('newsletterFrequency') != 0) {
    SyncedCron.start();
  };
});