Comments.getNotificationProperties = function (comment) {
  var commentAuthor = Meteor.users.findOne(comment.userId);
  var post = Posts.findOne(comment.postId);
  var properties = {
    profileUrl: commentAuthor && commentAuthor.getProfileUrl(true),
    postUrl: Posts.getPageUrl(post, true),
    authorName : Comments.getAuthorName(comment),
    postTitle: post.title,
    htmlBody: comment.htmlBody,
    commentUrl: Comments.getPageUrl(comment, true)
  };
  return properties;
};