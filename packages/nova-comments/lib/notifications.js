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

Telescope.notifications = Object.assign(Telescope.notifications, {
  newComment: {
    properties(data) {
      return Comments.getNotificationProperties(data.comment, data.post);
    },
    subject(properties) {
      return properties.authorName+' left a new comment on your post "' + properties.postTitle + '"';
    },
    emailTemplate: "newComment"
  },

  newReply: {
    properties(data) {
      return Comments.getNotificationProperties(data.comment, data.post);
    },
    subject(properties) {
      return properties.authorName+' replied to your comment on "'+properties.postTitle+'"';
    },
    emailTemplate: "newReply"
  },

  newCommentSubscribed: {
    properties(data) {
      return Comments.getNotificationProperties(data.comment, data.post);
    },
    subject(properties) {
      return properties.authorName+' left a new comment on "' + properties.postTitle + '"';
    },
    emailTemplate: "newComment"
  }
});