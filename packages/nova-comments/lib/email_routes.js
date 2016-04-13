Telescope.email.routes = Telescope.email.routes.concat([
  {
    name: "New Comment",
    path: "/email/new-comment/:_id?",
    action: (params, req, res, next) => {
      var html;
      var comment = typeof params.id === "undefined" ? Comments.findOne() : Comments.findOne(params.id);
      var post = Posts.findOne(comment.postId);
      if (!!comment) {
        html = Telescope.email.getTemplate('newComment')(Comments.getNotificationProperties(comment, post));
      } else {
        html = "<h3>No post found.</h3>"
      }
      res.end(Telescope.email.buildTemplate(html));
    }
  },
  {
    name: "New Reply",
    path: "/email/new-reply/:_id?",
    action: (params, req, res, next) => {
      var html;
      var comment = typeof params.id === "undefined" ? Comments.findOne() : Comments.findOne(params.id);
      var post = Posts.findOne(comment.postId);
      if (!!comment) {
        html = Telescope.email.getTemplate('newReply')(Comments.getNotificationProperties(comment, post));
      } else {
        html = "<h3>No post found.</h3>"
      }
      res.end(Telescope.email.buildTemplate(html));
    }
  }
]);