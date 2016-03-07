Telescope.notifications = Object.assign(Telescope.notifications, {
  newComment: {
    properties: function () {
      return Comments.getNotificationProperties(this.data.comment, this.data.post);
    },
    subject: function () {
      return this.authorName+' left a new comment on your post "' + this.postTitle + '"';
    },
    emailTemplate: "emailNewComment",
    onsiteTemplate: "notification_new_comment"
  },

  newReply: {
    properties: function () {
      return Comments.getNotificationProperties(this.data.comment, this.data.post);
    },
    subject: function () {
      return this.authorName+' replied to your comment on "'+this.postTitle+'"';
    },
    emailTemplate: "emailNewReply",
    onsiteTemplate: "notification_new_reply"
  },

  newCommentSubscribed: {
    properties: function () {
      return Comments.getNotificationProperties(this.data.comment, this.data.post);
    },
    subject: function () {
      return this.authorName+' left a new comment on "' + this.postTitle + '"';
    },
    emailTemplate: "notification_new_comment",
    onsite: "notification_new_comment"
  }
});