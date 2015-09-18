
// Notification email
Picker.route('/email/notification/:id?', function(params, req, res, next) {
  var notification = Herald.collection.findOne(params.id);
  var notificationContents = buildEmailNotification(notification);
  res.end(notificationContents.html);
});

// New user email
Picker.route('/email/new-user/:id?', function(params, req, res, next) {
  var html;
  var user = Meteor.users.findOne(params.id);
  var emailProperties = {
    profileUrl: Users.getProfileUrl(user),
    username: Users.getUserName(user)
  };
  html = Telescope.email.getTemplate('emailNewUser')(emailProperties);
  res.end(Telescope.email.buildTemplate(html));
});

// New post email
Picker.route('/email/new-post/:id?', function(params, req, res, next) {
  var html;
  var post = Posts.findOne(params.id);
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
  var post = Posts.findOne(params.id);
  if (!!post) {
    html = Telescope.email.getTemplate('emailPostApproved')(Posts.getNotificationProperties(post));
  } else {
    html = "<h3>No post found.</h3>"
  }
  res.end(Telescope.email.buildTemplate(html));
});

// New comment email
Picker.route('/email/new-comment/:id?', function(params, req, res, next) {
  var html;
  var comment = Comments.findOne(params.id);
  var post = Posts.findOne(comment.postId);
  if (!!comment) {
    html = Telescope.email.getTemplate('emailNewComment')(Comments.getNotificationProperties(comment, post));
  } else {
    html = "<h3>No post found.</h3>"
  }
  res.end(Telescope.email.buildTemplate(html));
});

// New reply email
Picker.route('/email/new-comment/:id?', function(params, req, res, next) {
  var html;
  var comment = Comments.findOne(params.id);
  var post = Posts.findOne(comment.postId);
  if (!!comment) {
    html = Telescope.email.getTemplate('emailNewReply')(Comments.getNotificationProperties(comment, post));
  } else {
    html = "<h3>No post found.</h3>"
  }
  res.end(Telescope.email.buildTemplate(html));
});

// Account approved email
Picker.route('/email/account-approved/:id?', function(params, req, res, next) {
  var user = Meteor.users.findOne(this.params.id);
  var emailProperties = {
    profileUrl: Users.getProfileUrl(user),
    username: Users.getUserName(user),
    siteTitle: Settings.get('title'),
    siteUrl: Telescope.utils.getSiteUrl()
  };
  var html = Handlebars.templates.emailAccountApproved(emailProperties);
  res.end(Telescope.email.buildTemplate(html));
});