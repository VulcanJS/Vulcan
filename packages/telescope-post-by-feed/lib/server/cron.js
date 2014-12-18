SyncedCron.add({
  name: 'Post by RSS feed',
  schedule: function(parser) {
    return parser.text('every 10 minutes');
  }, 
  job: function() {
    fetchFeeds();
  }
});