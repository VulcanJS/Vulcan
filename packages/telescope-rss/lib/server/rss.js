var RSS = Npm.require('rss');

var getMeta = function() {
  return {
    title: getSetting('title'),
    description: getSetting('tagline'),
    feed_url: Meteor.absoluteUrl()+'feed.xml',
    site_url: Meteor.absoluteUrl(),
    image_url: Meteor.absoluteUrl()+'img/favicon.png',
  };
};

servePostRSS = function() {
  var feed = new RSS(getMeta());

  Posts.find(getPostsParameters({}).find, {sort: {postedAt: -1}, limit: 20}).forEach(function(post) {
    var description = !!post.body ? post.body+'</br></br>' : '';
    feed.item({
     title: post.title,
     description: description+'<a href="'+getPostUrl(post._id)+'">Discuss</a>',
     author: post.author,
     date: post.postedAt,
     url: getPostLink(post),
     guid: post._id
    });
  });

  return feed.xml();
};

serveCommentRSS = function() {
  var feed = new RSS(getMeta());

  Comments.find({isDeleted: {$ne: true}}, {sort: {postedAt: -1}, limit: 20}).forEach(function(comment) {
    post = Posts.findOne(comment.postId);
    feed.item({
     title: 'Comment on '+post.title,
     description: comment.body+'</br></br>'+'<a href="'+getPostCommentUrl(post._id, comment._id)+'">Discuss</a>',
     author: comment.author,
     date: comment.postedAt,
     url: getCommentUrl(comment._id),
     guid: comment._id
    });
  });

  return feed.xml();
};
