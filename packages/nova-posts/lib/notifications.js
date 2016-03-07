Telescope.notifications = Object.assign(Telescope.notifications, {
  newPost: {
    properties: function () {
      return Posts.getNotificationProperties(this.data.post);
    },
    subject: function () {
      return this.postAuthorName+' has created a new post: '+this.postTitle;
    },
    emailTemplate: "emailNewPost"
  },

  newPendingPost: {
    properties: function () {
      return Posts.getNotificationProperties(this.data.post);
    },
    subject: function () {
      return this.postAuthorName+' has a new post pending approval: '+this.postTitle;
    },
    emailTemplate: "emailNewPendingPost"
  },

  postApproved: {
    properties: function () {
      return Posts.getNotificationProperties(this.data.post);
    },
    subject: function () {
      return 'Your post “'+this.postTitle+'” has been approved';
    },
    emailTemplate: "emailPostApproved",
    onsiteTemplate: "notification_post_approved"
  }
});