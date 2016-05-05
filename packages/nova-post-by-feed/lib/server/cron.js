import { fetchFeeds } from './fetch_feeds';

SyncedCron.options = {
  log: false,
  collectionName: 'cronHistory',
  utc: false, 
  collectionTTL: 172800
};

const addJob = () => {
  SyncedCron.add({
    name: 'Post by RSS feed',
    schedule: function(parser) {
      return parser.text('every 30 minutes');
    }, 
    job: () => {
      if (Feeds.find().count()) {
        fetchFeeds();
      }
    }
  });
};

Meteor.startup(() => addJob());
