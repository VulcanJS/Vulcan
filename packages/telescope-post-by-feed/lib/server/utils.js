var htmlParser = Npm.require('htmlparser2');
var htmlToText = Npm.require('html-to-text');

var getFirstAdminUser = function() {
  return Meteor.users.findOne({isAdmin: true}, {sort: {createdAt: 1}});
}

var insertPost = function(feedItem) {
  var post = {
    title: feedItem.title,
    body: htmlToText.fromString(feedItem.description),
    url: feedItem.link
  };

  // check that there are no posts with the same URL
  if (!!post.url) {
    var sixMonthsAgo = moment().subtract(6, 'months').toDate();
    var postWithSameLink = Posts.findOne({url: post.url, postedAt: {$gte: sixMonthsAgo}});

    if (typeof postWithSameLink !== 'undefined') {
      return;
    }
  }

  var title = cleanUp(post.title),
      body = post.body,
      user = getFirstAdminUser(),
      postId = '';

  // ------------------------------ Checks ------------------------------ //

  // check that user provided a title
  if(!post.title)
    post.title = 'Untitled';

  // ------------------------------ Properties ------------------------------ //

  // Basic Properties
  properties = {
    title: title,
    body: body,
    userId: user._id,
    author: getDisplayNameById(user._id),
    upvotes: 0,
    downvotes: 0,
    commentCount: 0,
    clickCount: 0,
    viewCount: 0,
    baseScore: 0,
    score: 0,
    status: 2,
    inactive: false,
    createdAt: new Date(),
    postedAt: new Date()
  };

  post = _.extend(post, properties);

  // ------------------------------ Insert ------------------------------ //

  post._id = Posts.insert(post);

  // ------------------------------ After Insert ------------------------------ //

  // increment posts count
  Meteor.users.update({_id: user._id}, {$inc: {postCount: 1}});

  Meteor.call('upvotePost', post, user);

  return post;
};

var handleFeed = function(error, feed) {
  if (error) return;

  feed.items.forEach(function(item, index, array) {
    insertPost(item);
  });
};

fetchFeeds = function() {
  var content;

  Feeds.find().forEach(function(rssUrl) {
    try {
      content = HTTP.get(rssUrl.url).content;
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
