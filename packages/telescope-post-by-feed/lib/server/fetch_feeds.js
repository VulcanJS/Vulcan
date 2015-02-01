var htmlParser = Npm.require('htmlparser2');
var toMarkdown = Npm.require('to-markdown').toMarkdown;
var he = Npm.require('he')

var getFirstAdminUser = function() {
  return Meteor.users.findOne({isAdmin: true}, {sort: {createdAt: 1}});
}

var handleFeed = function(error, feed) {
  if (error) return;

  var feedItems = _.first(feed.items, 20); // limit feed to 20 items just in case
  var userId = this._parser._options.userId;

  clog('// Parsing RSS feed: '+ feed.title)

  var newItemsCount = 0;

  feedItems.forEach(function(item, index, array) {

    // if item has no id, use the URL to give it one
    if (!item.id)
      item.id = item.link;

    // check if post already exists
    if (!!Posts.findOne({feedItemId: item.id})) {
      // clog('// Feed item already imported')
    } else {
      newItemsCount++;

      var post = {
        title: he.decode(item.title),
        url: item.link,
        feedId: feed.id,
        feedItemId: item.id,
        userId: userId
      }

      if (item.description)
        post.body = toMarkdown(he.decode(item.description));

      // console.log(feed)

      // if RSS item link is a 301 or 302 redirect, follow the redirect
      var get = HTTP.get(item.link, {followRedirects: false});
      if (!!get.statusCode && (get.statusCode === 301 || get.statusCode === 302) && !!get.headers && !!get.headers.location) {
        post.url = get.headers.location;
      }

      // if RSS item has a date, use it
      if (item.pubDate)
        post.postedAt = moment(item.pubDate).toDate();

      try {
        submitPost(post);
      } catch (error) {
        // catch errors so they don't stop the loop
        clog(error);
      }

    }
  });

  clog('// Found ' + newItemsCount + ' new feed items')
};

fetchFeeds = function() {
  var content;

  Feeds.find().forEach(function(feed) {

    // if feed doesn't specify a user, default to admin
    var userId = !!feed.userId ? feed.userId : getFirstAdminUser()._id;

    try {

      content = HTTP.get(feed.url).content;
      var feedHandler = new htmlParser.FeedHandler(handleFeed);
      var parser = new htmlParser.Parser(feedHandler, {xmlMode: true, userId: userId});
      parser.write(content);
      parser.end();

    } catch (error) {

      console.log(error);
      return true; // just go to next url
      
    }
  });
}

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
