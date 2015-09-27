fetchFeeds = function() {
  let contentBuffer;

  Feeds.find().forEach(function(feed) {

    // if feed doesn't specify a user, default to admin
    let userId = !!feed.userId ? feed.userId : getFirstAdminUser()._id;

    try {
      contentBuffer = HTTP.get(feed.url, {responseType: 'buffer'}).content;
      let feedHandler = selectFeedHandler(contentBuffer, userId, feed);
      feedHandler.handle();
    } catch (error) {
      console.log(error);
      return true; // just go to next feed URL
    }
  });
};

Meteor.methods({
  fetchFeeds: function() {
    fetchFeeds();
  },

  testEntities: function(text) {
    console.log(he.decode(text));
  },

  testToMarkdown: function(text) {
    console.log(toMarkdown(text));
  }
});
