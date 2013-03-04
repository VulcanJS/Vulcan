// serve up RSS at the right url
Meteor.serve('api', function() {
  var posts = [];
  Posts.find({status: STATUS_APPROVED}, {sort: {submitted: -1}, limit: 100}).forEach(function(post) {
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
});