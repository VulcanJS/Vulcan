class _DefaultFeedHandler {
  constructor(contentBuffer, userId, feedCategories, feedId) {
    this.contentBuffer = contentBuffer;
    this.userId = userId;
    this.feedCategories = feedCategories;
    this.feedId = feedId;
  }

  /*
  ** customisePost
  **
  ** Available customisation hook for subclasses.
  ** As this is the base class, just an identity function.
  */
  customisePost(post, item) {
    return post;
  }

  getStream(content) {
    let stream = new Readable();
    stream.push(content);
    stream.push(null);

    return stream;
  }

  getItemCategories(item) {
    let self = this;
    let itemCategories = [];

    // loop over RSS categories for the current item if it has any
    if (item.categories && item.categories.length > 0) {
      item.categories.forEach(function(name) {

        // if the RSS category corresponds to a Telescope cateogry, add it
        let category = Categories.findOne({name: name}, {fields: {_id: 1}});
        if (category) {
          itemCategories.push(category._id);
        }

      });
    }

    // add predefined feed categories if there are any and remove any duplicates
    if (!!self.feedCategories) {
      itemCategories = _.uniq(itemCategories.concat(self.feedCategories));
    }

    return itemCategories;
  }

  meta(meta) {
    Telescope.log('// Parsing RSS feed: '+ meta.title);
  }

  error(err) {
    Telescope.log(err);
  }

  readable(feedParser) {
    let self = this, item;

    while (item = feedParser.read()) {
      // if item has no guid, use the URL to give it one
      if (!item.guid) {
        item.guid = item.link;
      }

      // check if post already exists
      if (!!Posts.findOne({feedItemId: item.guid})) {
        Telescope.log('// Feed item already imported');
        continue;
      }

      let post = {
        title: he.decode(item.title),
        url: item.link,
        feedId: self.feedId,
        feedItemId: item.guid,
        userId: self.userId,
        categories: self.getItemCategories(item)
      };

      if (item.description)
        post.body = toMarkdown(he.decode(item.description));

      // console.log(item)

      // if RSS item link is a 301 or 302 redirect, follow the redirect
      let get = HTTP.get(item.link, {followRedirects: false});
      if (!!get.statusCode && (get.statusCode === 301 || get.statusCode === 302) &&
          !!get.headers && !!get.headers.location) {
            post.url = get.headers.location;
          }

      // if RSS item has a date, use it
      if (item.pubdate)
        post.postedAt = moment(item.pubdate).toDate();

      try {
        post = self.customisePost(post, item);
        Posts.submit(post);
      } catch (error) {
        // catch errors so they don't stop the loop
        Telescope.log(error);
      }
    }
  }

  handle() {
    let content = normalizeEncoding(this.contentBuffer);
    let stream = this.getStream(content);
    let feedParser = new FeedParser();
    let self = this;

    stream.pipe(feedParser);

    feedParser.on('meta', Meteor.bindEnvironment(self.meta));

    feedParser.on('error', Meteor.bindEnvironment(self.error));

    feedParser.on('readable', Meteor.bindEnvironment(function() {
      self.readable(feedParser);
    }, function() {
      Telescope.log('Failed to bind environment');
    }));
  }
}

// Deal with non-package scoping of class
// https://github.com/meteor/meteor/issues/5296
DefaultFeedHandler = _DefaultFeedHandler;
Telescope.feedHandlers.add('DefaultFeedHandler', DefaultFeedHandler);
