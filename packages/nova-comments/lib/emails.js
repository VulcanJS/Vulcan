const getComment = (commentId) => {
  return typeof Comments.findOne(commentId) === "undefined" ? Comments.findOne() : Comments.findOne(commentId);
};

Telescope.email.addEmails({

  newComment: {
    template: "newComment",
    path: "/email/new-comment/:_id?",
    getProperties: Comments.getNotificationProperties,
    subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
      return authorName+' left a new comment on your post "' + postTitle + '"';
    },
    getTestObject: getComment
  },

  newReply: {
    template: "newReply",
    path: "/email/new-reply/:_id?",
    getProperties: Comments.getNotificationProperties,
    subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
      return authorName+' replied to your comment on "'+postTitle+'"';
    },
    getTestObject: getComment
  },

  newCommentSubscribed: {
    template: "newComment",
    path: "/email/new-comment-subscribed/:_id?",
    getProperties: Comments.getNotificationProperties,
    subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
      return authorName+' left a new comment on "' + postTitle + '"';
    },
    getTestObject: getComment
  }

});