SyncedCron.options = {
  log: false,
  collectionName: 'cronHistory',
  utc: false,
  collectionTTL: 172800
}

var addJob = function() {
  let parserFrequency = Settings.get(FEED_PARSER_FREQUENCY_PROPERTY_NAME, FEED_PARSER_FREQUENCY_PROPERTY_DEFAULT_VALUE);

  SyncedCron.add({
    name: 'Post by RSS feed',
    schedule: function(parser) {
      return parser.text(parserFrequency);
    },

    job: function() {
      if (Feeds.find().count()) {
        fetchFeeds();
      }
    }
  });
}

Meteor.startup(function() {
  addJob();
});
