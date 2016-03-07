serveAPI = function(terms){
  var posts = [];

  var parameters = Posts.parameters.get(terms);

  Posts.find(parameters.find, parameters.options).forEach(function(post) {
    var url = Posts.getLink(post);
    var postOutput = {
      title: post.title,
      headline: post.title, // for backwards compatibility
      author: post.author,
      date: post.postedAt,
      url: url,
      pageUrl: Posts.getPageUrl(post, true),
      guid: post._id
    };

    if(post.body)
      postOutput.body = post.body;

    if(post.url)
      postOutput.domain = Telescope.utils.getDomain(url);

    if (post.thumbnailUrl) {
      postOutput.thumbnailUrl = Telescope.utils.addHttp(post.thumbnailUrl);
    }

    var twitterName = Users.getTwitterNameById(post.userId);
    if(twitterName)
      postOutput.twitterName = twitterName;

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
          commentsToDelete.push(index);
        }
      }
    });

    commentsToDelete.reverse().forEach(function(index) {
      comments.splice(index,1);
    });

    postOutput.comments = comments;

    posts.push(postOutput);
  });

  return JSON.stringify(posts);
};
