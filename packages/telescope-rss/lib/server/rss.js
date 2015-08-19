RSS = Npm.require('rss');

getMeta = function(url) {
  var siteUrl = Settings.get('siteUrl', Meteor.absoluteUrl());
  return {
    title: Settings.get('title'),
    description: Settings.get('tagline'),
    feed_url: siteUrl+url,
    site_url: siteUrl,
    image_url: siteUrl+'img/favicon.png'
  };
};

servePostRSS = function(view, url, category) {
  var feed = new RSS(getMeta(url));

  var terms = {view: view, limit: 20};
  if (category) {
    terms.category = category;
  };
  var params = Posts.getSubParams(terms);
  delete params['options']['sort']['sticky'];

  Posts.find(params.find, params.options).forEach(function(post) {

    var description = !!post.body ? post.body+'</br></br>' : '';
    var feedItem = {
      title: post.title,
      description: description + '<a href="' + post.getPageUrl(true) + '">Discuss</a>',
      author: post.author,
      date: post.postedAt,
      guid: post._id,
      url: Posts.getShareableLink(post)
    };

    if (post.thumbnailUrl) {
      var url = Telescope.utils.addHttp(post.thumbnailUrl);
      feedItem.custom_elements = [{"imageUrl":url}, {"content": url}];
    }

    feed.item(feedItem);
  });

  return feed.xml();
};

serveCommentRSS = function() {
  var feed = new RSS(getMeta(Router.path('rss_comments')));

  Comments.find({isDeleted: {$ne: true}}, {sort: {postedAt: -1}, limit: 20}).forEach(function(comment) {
    post = Posts.findOne(comment.postId);
    feed.item({
     title: 'Comment on '+post.title,
     description: comment.body+'</br></br>'+'<a href="'+Telescope.utils.getPostCommentUrl(post._id, comment._id)+'">Discuss</a>',
     author: comment.author,
     date: comment.postedAt,
     url: comment.getPageUrl(true),
     guid: comment._id
    });
  });

  return feed.xml();
};
