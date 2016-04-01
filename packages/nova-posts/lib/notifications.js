Telescope.notifications = Object.assign(Telescope.notifications, {
  newPost: {
    properties(data) {
      return Posts.getNotificationProperties(data.post);
    },
    subject(properties) {
      return properties.postAuthorName+' has created a new post: '+properties.postTitle;
    },
    emailTemplate: "newPost"
  },

  newPendingPost: {
    properties(data) {
      return Posts.getNotificationProperties(data.post);
    },
    subject(properties) {
      return properties.postAuthorName+' has a new post pending approval: '+properties.postTitle;
    },
    emailTemplate: "newPendingPost"
  },

  postApproved: {
    properties(data) {
      return Posts.getNotificationProperties(data.post);
    },
    subject(properties) {
      return 'Your post “'+properties.postTitle+'” has been approved';
    },
    emailTemplate: "postApproved"
  }
});