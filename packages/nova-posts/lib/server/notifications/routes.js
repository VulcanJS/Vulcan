// New post email
Picker.route('/email/new-post/:id?', function(params, req, res, next) {
  var html;
  var post = typeof params.id === "undefined" ? Posts.findOne() : Posts.findOne(params.id);
  if (!!post) {
    html = Telescope.email.getTemplate('emailNewPost')(Posts.getNotificationProperties(post));
  } else {
    html = "<h3>No post found.</h3>"
  }
  res.end(Telescope.email.buildTemplate(html));
});

// Post approved
Picker.route('/email/post-approved/:id?', function(params, req, res, next) {
  var html;
  var post = typeof params.id === "undefined" ? Posts.findOne() : Posts.findOne(params.id);
  if (!!post) {
    html = Telescope.email.getTemplate('emailPostApproved')(Posts.getNotificationProperties(post));
  } else {
    html = "<h3>No post found.</h3>"
  }
  res.end(Telescope.email.buildTemplate(html));
});