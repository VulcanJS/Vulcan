selectFeedHandler = function(contentBuffer, userId, feed) {
  if (feed.feedHandler) {
    try {
      let FeedHandlerClass = Telescope.feedHandlers.get(feed.feedHandler);
      if (FeedHandlerClass) {
        return new FeedHandlerClass(contentBuffer, userId, feed.feedCategories, feed.feedId);
      } else {
        Telescope.log('// No feed handler named ' + feed.feedHandler + ' found under Telescope.feedHandlers');
      }
    } catch (e) {
      Telescope.log(e);
    } // If no such handler, use default
  }

  return new DefaultFeedHandler(contentBuffer, userId, feed.feedCategories, feed.feedId);
};
