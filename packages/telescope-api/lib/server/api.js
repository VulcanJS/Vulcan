serveAPI = function(limitSegment){
  var posts = [];
  var limit = typeof limitSegment === 'undefined' ? 20 : limitSegment // default limit: 20 posts

  Posts.find({status: STATUS_APPROVED}, {sort: {postedAt: -1}, limit: limit}).forEach(function(post) {
    var url = getPostLink(post);
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

    var comments = [];

    Comments.find({postId: post._id}, {sort: {postedAt: -1}, limit: 50}).forEach(function(comment) {
      var commentProperties = {
       body: comment.body,
       author: comment.author,
       date: comment.postedAt,
       guid: comment._id,
       parentCommentId: comment.parentCommentId
      };
      comments.push(commentProperties);
    });

    var commentsToDelete = [];

    comments.forEach(function(comment, index) {
      if (comment.parentCommentId) {
        var parent = comments.filter(function(obj) {
          return obj.guid === comment.parentCommentId;
        })[0];
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(JSON.parse(JSON.stringify(comment)));
          commentsToDelete.push(index)
        }
      }
    });

    commentsToDelete.reverse().forEach(function(index) {
      comments.splice(index,1);
    });

    properties.comments = comments;

    posts.push(properties);
  });

  return JSON.stringify(posts);
};
