Telescope.email.routes = Telescope.email.routes.concat([
  {
    name: "New Post",
    path: "/email/new-post/:_id?",
    action: (params, req, res, next) => {
      var html;
      var post = typeof params.id === "undefined" ? Posts.findOne() : Posts.findOne(params.id);
      if (!!post) {
        html = Telescope.email.getTemplate('newPost')(Posts.getNotificationProperties(post));
      } else {
        html = "<h3>No post found.</h3>"
      }
      res.end(Telescope.email.buildTemplate(html));
    }
  },
  {
    name: "Post Approved",
    path: "/email/post-approved/:_id?",
    action: (params, req, res, next) => {
      var html;
      var post = typeof params.id === "undefined" ? Posts.findOne() : Posts.findOne(params.id);
      if (!!post) {
        html = Telescope.email.getTemplate('postApproved')(Posts.getNotificationProperties(post));
      } else {
        html = "<h3>No post found.</h3>"
      }
      res.end(Telescope.email.buildTemplate(html));
    }
  }
]);