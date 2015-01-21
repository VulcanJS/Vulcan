SyncedCron.options = {
  log: false,
  collectionName: 'cronHistory',
  utc: false, 
  collectionTTL: 172800
}

var addJob = function () {
  SyncedCron.add({
    name: 'Post by RSS feed',
    schedule: function(parser) {
      return parser.text('every 30 minutes');
    }, 
    job: function() {
      if (Feeds.find().count()) {
        fetchFeeds();
      }
    }
  });
}

Meteor.startup(function () {
  addJob();
})
