Telescope.email.emails = Object.assign(Telescope.email.emails, {

  newPost: {
    template: "newPost",
    path: "/email/new-post/:_id?",
    getProperties: Posts.getNotificationProperties,
    subject({postAuthorName="[postAuthorName]", postTitle="[postTitle]"}) {
      return postAuthorName+' has created a new post: '+postTitle;
    },
    getTestHTML(postId) {
      var post = typeof params._id === "undefined" ? Posts.findOne() : Posts.findOne(postId);
      return !!post ? Telescope.email.getTemplate(this.template)(this.getProperties(post)) : "<h3>No post found.</h3>";
    }
  },

  newPendingPost: {
    template: "newPendingPost",
    path: "/email/new-pending-post/:_id?",
    getProperties: Posts.getNotificationProperties,
    subject({postAuthorName="[postAuthorName]", postTitle="[postTitle]"}) {
      return postAuthorName+' has a new post pending approval: '+postTitle;
    },
    getTestHTML(postId) {
      var post = typeof postId === "undefined" ? Posts.findOne() : Posts.findOne(postId);
      return !!post ? Telescope.email.getTemplate(this.template)(this.getProperties(post)) : "<h3>No post found.</h3>";
    }
  },

  postApproved: {
    template: "postApproved",
    path: "/email/post-approved/:_id?",
    getProperties: Posts.getNotificationProperties,
    subject({postTitle="[postTitle]"}) {
      return 'Your post “'+postTitle+'” has been approved';
    },
    getTestHTML(postId) {
      var post = typeof postId === "undefined" ? Posts.findOne() : Posts.findOne(postId);
      return !!post ? Telescope.email.getTemplate(this.template)(this.getProperties(post)) : "<h3>No post found.</h3>";
    }
  }

});