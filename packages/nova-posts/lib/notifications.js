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