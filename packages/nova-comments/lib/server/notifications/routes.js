
// New comment email
Picker.route('/email/new-comment/:id?', function(params, req, res, next) {
  var html;
  var comment = typeof params.id === "undefined" ? Comments.findOne() : Comments.findOne(params.id);
  var post = Posts.findOne(comment.postId);
  if (!!comment) {
    html = Telescope.email.getTemplate('emailNewComment')(Comments.getNotificationProperties(comment, post));
  } else {
    html = "<h3>No post found.</h3>"
  }
  res.end(Telescope.email.buildTemplate(html));
});

// New reply email
Picker.route('/email/new-reply/:id?', function(params, req, res, next) {
  var html;
  var comment = typeof params.id === "undefined" ? Comments.findOne() : Comments.findOne(params.id);
  var post = Posts.findOne(comment.postId);
  if (!!comment) {
    html = Telescope.email.getTemplate('emailNewReply')(Comments.getNotificationProperties(comment, post));
  } else {
    html = "<h3>No post found.</h3>"
  }
  res.end(Telescope.email.buildTemplate(html));
});
