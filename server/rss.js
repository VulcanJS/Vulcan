// serve up RSS at the right url
Meteor.serve('feed.xml', function() {
  var feed = new RSS({
    title: getSetting('title'),
    description: getSetting('tagline')
  });
  
  Posts.find({status: STATUS_APPROVED}, {sort: {submitted: -1}}).forEach(function(post) {
    feed.item({
     title: post.headline,
     description: post.body+'</br></br> <a href="'+getPostUrl(post._id)+'">Comments</a>',
     author: post.author,
     date: post.submitted,
     url: (post.url ? post.url : getPostUrl(post._id))
    });
  });
  
  return feed.xml();
});