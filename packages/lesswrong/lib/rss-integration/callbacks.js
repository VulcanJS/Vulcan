import { addCallback, editMutation } from 'meteor/vulcan:core';
import RSSFeeds from '../collections/rssfeeds/collection.js';

const populateRawFeed = (feed) => {
  const feedparser = require('feedparser-promised');
  const url = feed.url;
  feedparser.parse(url).then(currentPosts => {
    var set = {
      rawFeed: currentPosts,
    };

    editMutation({
      collection: RSSFeeds,
      documentId: feed._id,
      set: set,
      validate: false,
    })
  });
}

addCallback("rssfeeds.new.async", populateRawFeed);
