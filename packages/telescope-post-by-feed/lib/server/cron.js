var addJob = function () {
  SyncedCron.add({
    name: 'Post by RSS feed',
    schedule: function(parser) {
      return parser.text('every 30 minutes');
    }, 
    job: function() {
      fetchFeeds();
    }
  });
}

Meteor.startup(function () {
  if (getSetting('enableFeeds', false)) {
    addJob();
  }
})