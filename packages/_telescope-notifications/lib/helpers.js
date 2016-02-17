/**
 * Use user and post properties to populate post notifications objects.
 * @param {Object} post
 */
Posts.getNotificationProperties = function (post) {
  var postAuthor = Meteor.users.findOne(post.userId);
  var properties = {
    postAuthorName : Posts.getAuthorName(post),
    postTitle : Telescope.utils.cleanUp(post.title),
    profileUrl: Users.getProfileUrl(postAuthor, true),
    postUrl: Posts.getPageUrl(post, true),
    thumbnailUrl: post.thumbnailUrl,
    linkUrl: !!post.url ? Telescope.utils.getOutgoingUrl(post.url) : Posts.getPageUrl(post, true)
  };

  if(post.url)
    properties.url = post.url;

  if(post.htmlBody)
    properties.htmlBody = post.htmlBody;

  return properties;
};

/**
 * Use comment, user, and post properties to populate comment notifications objects.
 * @param {Object} comment
 */
Comments.getNotificationProperties = function (comment, post) {
  var commentAuthor = Meteor.users.findOne(comment.userId);
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
