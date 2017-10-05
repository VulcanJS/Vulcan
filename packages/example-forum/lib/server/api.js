import { Posts } from '../modules/posts/index.js';
import { Comments } from '../modules/comments/index.js';
import Users from 'meteor/vulcan:users';
import { Utils } from 'meteor/vulcan:core';
import { Picker } from 'meteor/meteorhacks:picker';

export const servePostsApi = (terms) => {
  var posts = [];

  if (!terms.limit) {
    terms.limit = 50;
  }
  
  var parameters = Posts.getParameters(terms);

  const postsCursor = Posts.find(parameters.selector, parameters.options);

  postsCursor.forEach(function(post) {
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
      postOutput.domain = Utils.getDomain(url);

    if (post.thumbnailUrl) {
      postOutput.thumbnailUrl = Utils.addHttp(post.thumbnailUrl);
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

// for backwards compatibility's sake, accept a "limit" segment
Picker.route('/api/:limit?', function(params, req, res, next) {
  if (typeof params.limit !== "undefined") {
    params.query.limit = params.limit;
  }
  res.end(servePostsApi(params.query));
});
