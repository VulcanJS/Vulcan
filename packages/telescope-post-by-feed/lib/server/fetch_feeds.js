var toMarkdown = Npm.require('to-markdown').toMarkdown;
var he = Npm.require('he');
var FeedParser = Npm.require('feedparser');
var Readable = Npm.require('stream').Readable;

var getFirstAdminUser = function() {
  return Meteor.users.findOne({isAdmin: true}, {sort: {createdAt: 1}});
};

var feedHandler = {
  getStream: function(content) {
    var stream = new Readable();
    stream.push(content);
    stream.push(null);

    return stream;
  },

  getItemCategories: function(item, feedCategories) {
    
    var itemCategories = [];
    
    // loop over RSS categories for the current item if it has any
    if (item.categories && item.categories.length > 0) {
      item.categories.forEach(function(name) {

        // if the RSS category corresponds to a Telescope cateogry, add it
        var category = Categories.findOne({name: name}, {fields: {_id: 1}});
        if (category) {
          itemCategories.push(category._id);
        }

      });
    }

    // add predefined feed categories if there are any and remove any duplicates
    if (!!feedCategories) {
      itemCategories = _.uniq(itemCategories.concat(feedCategories));
    }

    return itemCategories;
  },

  handle: function(content, userId, feedCategories, feedId) {
    var stream = this.getStream(content),
    feedParser = new FeedParser(),
    newItemsCount = 0,
    self = this;

    stream.pipe(feedParser);

    feedParser.on('meta', Meteor.bindEnvironment(function(meta) {
      clog('// Parsing RSS feed: '+ meta.title);
    }));

    feedParser.on('error', Meteor.bindEnvironment(function(error) {
      clog(error);
    }));

    feedParser.on('readable', Meteor.bindEnvironment(function() {
      var s = this, item;

      while (item = s.read()) {
        // if item has no guid, use the URL to give it one
        if (!item.guid) {
          item.guid = item.link;
        }

        // check if post already exists
        if (!!Posts.findOne({feedItemId: item.guid})) {
          clog('// Feed item already imported');
          continue;
        }

        newItemsCount++;

        var post = {
          title: he.decode(item.title),
          url: item.link,
          feedId: feedId,
          feedItemId: item.guid,
          userId: userId,
          categories: self.getItemCategories(item, feedCategories)
        };

        if (item.description)
          post.body = toMarkdown(he.decode(item.description));

        // console.log(item)

        // if RSS item link is a 301 or 302 redirect, follow the redirect
        var get = HTTP.get(item.link, {followRedirects: false});
        if (!!get.statusCode && (get.statusCode === 301 || get.statusCode === 302) &&
            !!get.headers && !!get.headers.location) {
              post.url = get.headers.location;
            }

        // if RSS item has a date, use it
        if (item.pubdate)
          post.postedAt = moment(item.pubdate).toDate();

        try {
          submitPost(post);
        } catch (error) {
          // catch errors so they don't stop the loop
          clog(error);
        }
      }

      // clog('// Found ' + newItemsCount + ' new feed items');
    }, function() {
      clog('Failed to bind environment');
    }, feedParser));
  }
};

var fetchFeeds = function() {
  var content;

  Feeds.find().forEach(function(feed) {

    // if feed doesn't specify a user, default to admin
    var userId = !!feed.userId ? feed.userId : getFirstAdminUser()._id;
    var feedCategories = feed.categories;
    var feedId = feed._id;

    try {
      content = HTTP.get(feed.url).content;
      feedHandler.handle(content, userId, feedCategories, feedId);
    } catch (error) {
      console.log(error);
      return true; // just go to next feed URL
    }
  });
};

Meteor.methods({
  fetchFeeds: function () {
    fetchFeeds();
  },
  testEntities: function (text) {
    console.log(he.decode(text));
  },
  testToMarkdown: function (text) {
    console.log(toMarkdown(text));
  }
})
