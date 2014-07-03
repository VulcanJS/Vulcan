serveAPI = function(limitSegment){
  var posts = [];
  var limit = typeof limitSegment === 'undefined' ? 20 : limitSegment // default limit: 20 posts

  Posts.find({status: STATUS_APPROVED}, {sort: {postedAt: -1}, limit: limit}).forEach(function(post) {
    var url = (post.url ? post.url : getPostUrl(post._id));
    var properties = {
     title: post.title,
     headline: post.title, // for backwards compatibility
     author: post.author,
     date: post.postedAt,
     url: url,
     guid: post._id
    };

    if(post.body)
      properties.body = post.body;

    if(post.url)
      properties.domain = getDomain(url);

    if(twitterName = getTwitterNameById(post.userId))
      properties.twitterName = twitterName;

    posts.push(properties);
  });

  return JSON.stringify(posts); 
};