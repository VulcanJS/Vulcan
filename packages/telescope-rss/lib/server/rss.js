serveRSS = function() {
  var feed = new RSS({
    title: getSetting('title'),
    description: getSetting('tagline'),
    feed_url: Meteor.absoluteUrl()+'feed.xml',
    site_url: Meteor.absoluteUrl(),
    image_url: Meteor.absoluteUrl()+'img/favicon.png',
  });
  
  Posts.find({status: STATUS_APPROVED}, {sort: {postedAt: -1}, limit: 20}).forEach(function(post) {
    feed.item({
     title: post.title,
     description: post.body+'</br></br> <a href="'+getPostPageUrl(post._id)+'">Comments</a>',
     author: post.author,
     date: post.postedAt,
     url: getPostLink(post),
     guid: post._id
    });
  });
  
  return feed.xml();
};
