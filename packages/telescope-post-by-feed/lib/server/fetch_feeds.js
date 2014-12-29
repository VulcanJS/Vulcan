var htmlParser = Npm.require('htmlparser2');
var toMarkdown = Npm.require('to-markdown').toMarkdown;
var he = Npm.require('he')

var getFirstAdminUser = function() {
  return Meteor.users.findOne({isAdmin: true}, {sort: {createdAt: 1}});
}

var handleFeed = function(error, feed) {
  if (error) return;

  var feedItems = _.first(feed.items, 20); // limit feed to 20 items just in case

  clog('// Parsing RSS feed: '+ feed.title)

  var newItemsCount = 0;

  feedItems.forEach(function(item, index, array) {
    
    // check if post already exists
    if (!!Posts.findOne({feedItemId: item.id})) {
      // clog('// Feed item already imported')
    } else {
      newItemsCount++;

      var post = {
        title: item.title,
        body: toMarkdown(he.decode(item.description)),
        url: item.link,
        feedId: feed.id,
        feedItemId: item.id,
        userId: getFirstAdminUser()._id
      }

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
    try {
      content = HTTP.get(feed.url).content;
    } catch (e) {
      // just go to next url
      return true;
    }

    var feedHandler = new htmlParser.FeedHandler(handleFeed);

    var parser = new htmlParser.Parser(feedHandler, {xmlMode: true});
    parser.write(content);
    parser.end()
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
