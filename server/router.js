serveAPI = function(limit){
  var posts = [];
  limit = typeof limit == 'undefined' ? 100 : limit;
  console.log(limit)
  Posts.find({status: STATUS_APPROVED}, {sort: {submitted: -1}, limit: limit}).forEach(function(post) {
    var url = (post.url ? post.url : getPostUrl(post._id));
    var properties = {
     headline: post.headline,
     author: post.author,
     date: post.submitted,
     url: url,
     guid: post._id
    };

    if(post.body)
      properties['body'] = post.body;

    if(post.url)
      properties['domain'] = getDomain(url);

    if(twitterName = getTwitterNameById(post.userId))
      properties['twitterName'] = twitterName;

    posts.push(properties);
  });

  return JSON.stringify(posts); 
}

Meteor.Router.add({
  '/feed.xml': function() {
    var feed = new RSS({
      title: getSetting('title'),
      description: getSetting('tagline'),
      feed_url: Meteor.absoluteUrl()+'feed.xml',
      site_url: Meteor.absoluteUrl(),
      image_url: Meteor.absoluteUrl()+'img/favicon.png',
    });
    
    Posts.find({status: STATUS_APPROVED}, {sort: {submitted: -1}, limit: 20}).forEach(function(post) {
      feed.item({
       title: post.headline,
       description: post.body+'</br></br> <a href="'+getPostUrl(post._id)+'">Comments</a>',
       author: post.author,
       date: post.submitted,
       url: (post.url ? post.url : getPostUrl(post._id)),
       guid: post._id
      });
    });
    
    return feed.xml();
  },
  
  '/api/': serveAPI,
  
  '/api/:limit': serveAPI

});
