var RSS = Npm.require('rss');

var getMeta = function(url) {
  var siteUrl = Settings.get('siteUrl', Meteor.absoluteUrl());
  return {
    title: Settings.get('title'),
    description: Settings.get('tagline'),
    feed_url: siteUrl+url,
    site_url: siteUrl,
    image_url: siteUrl+'img/favicon.png',
  };
};

servePostRSS = function(view, url) {
  var feed = new RSS(getMeta(url));

  var params = Posts.getSubParams({view: view, limit: 20});
  delete params['options']['sort']['sticky'];

  Posts.find(params.find, params.options).forEach(function(post) {
    var description = !!post.body ? post.body+'</br></br>' : '';
    feed.item({
     title: post.title,
     description: description + '<a href="' + post.getPageUrl(true) + '">Discuss</a>',
     author: post.author,
     date: post.postedAt,
     url: Posts.getLink(post),
     guid: post._id
    });
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
