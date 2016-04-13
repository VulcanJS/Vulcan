Telescope.email.emails = Object.assign(Telescope.email.emails, {

  newComment: {
    template: "newComment",
    path: "/email/new-comment/:_id?",
    getProperties: Comments.getNotificationProperties,
    subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
      return authorName+' left a new comment on your post "' + postTitle + '"';
    },
    getTestHTML(commentId) {
      var comment = typeof commentId === "undefined" ? Comments.findOne() : Comments.findOne(commentId);
      var post = Posts.findOne(comment.postId);
      return !!comment ? Telescope.email.getTemplate(this.template)(this.getProperties(comment, post)) : "<h3>No comment found.</h3>";
    }
  },

  newReply: {
    template: "newReply",
    path: "/email/new-reply/:_id?",
    getProperties: Comments.getNotificationProperties,
    subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
      return authorName+' replied to your comment on "'+postTitle+'"';
    },
    getTestHTML(commentId) {
      var comment = typeof commentId === "undefined" ? Comments.findOne() : Comments.findOne(commentId);
      var post = Posts.findOne(comment.postId);
      return !!comment ? Telescope.email.getTemplate(this.template)(this.getProperties(comment, post)) : "<h3>No comment found.</h3>";
    }
  },

  newCommentSubscribed: {
    template: "newComment",
    path: "/email/new-comment-subscribed/:_id?",
    getProperties: Comments.getNotificationProperties,
    subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
      return authorName+' left a new comment on "' + postTitle + '"';
    },
    getTestHTML(commentId) {
      var comment = typeof commentId === "undefined" ? Comments.findOne() : Comments.findOne(commentId);
      var post = Posts.findOne(comment.postId);
      return !!comment ? Telescope.email.getTemplate(this.template)(this.getProperties(comment, post)) : "<h3>No comment found.</h3>";
    }
  }

});