const SuperClass = Telescope.feedHandlers.get('DefaultFeedHandler');

class ExampleFeedHandler extends SuperClass {
  constructor(contentBuffer, userId, feedCategories, feedId) {
    super(contentBuffer, userId, feedCategories, feedId);
  }

  /*
  ** customisePost
  **
  ** Specialised logic for this feed
  */
  customisePost(post, item) {
    post.title = post.title.toLowerCase();
    return post;
  }
}

Telescope.feedHandlers.add('ExampleFeedHandler', ExampleFeedHandler);
