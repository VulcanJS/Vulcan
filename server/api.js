serveAPI = function(limitSegment){
  var posts = [];
  var limit = 100; // default limit: 100 posts
  
  if(typeof limitSegment !== 'undefined')
    limit = limitSegment;

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
      properties.body = post.body;

    if(post.url)
      properties.domain = getDomain(url);

    if(twitterName = getTwitterNameById(post.userId))
      properties.twitterName = twitterName;

    posts.push(properties);
  });

  return JSON.stringify(posts); 
};