import Email from 'meteor/nova:email';
import Campaign from 'meteor/nova:newsletter';

// New post email
Picker.route('/email/new-post/:id?', function(params, req, res, next) {
  var html;
  var post = typeof params.id === "undefined" ? Posts.findOne() : Posts.findOne(params.id);
  if (!!post) {
    html = Email.getTemplate('newPost')(Posts.getNotificationProperties(post));
  } else {
    html = "<h3>No post found.</h3>"
  }
  res.end(Email.buildTemplate(html));
});

// Post approved
Picker.route('/email/post-approved/:id?', function(params, req, res, next) {
  var html;
  var post = typeof params.id === "undefined" ? Posts.findOne() : Posts.findOne(params.id);
  if (!!post) {
    html = Email.getTemplate('postApproved')(Posts.getNotificationProperties(post));
  } else {
    html = "<h3>No post found.</h3>"
  }
  res.end(Email.buildTemplate(html));
});

// New comment email
Picker.route('/email/new-comment/:id?', function(params, req, res, next) {
  var html;
  var comment = typeof params.id === "undefined" ? Comments.findOne() : Comments.findOne(params.id);
  var post = Posts.findOne(comment.postId);
  if (!!comment) {
    html = Email.getTemplate('newComment')(Comments.getNotificationProperties(comment, post));
  } else {
    html = "<h3>No post found.</h3>"
  }
  res.end(Email.buildTemplate(html));
});

// New reply email
Picker.route('/email/new-reply/:id?', function(params, req, res, next) {
  var html;
  var comment = typeof params.id === "undefined" ? Comments.findOne() : Comments.findOne(params.id);
  var post = Posts.findOne(comment.postId);
  if (!!comment) {
    html = Email.getTemplate('newReply')(Comments.getNotificationProperties(comment, post));
  } else {
    html = "<h3>No post found.</h3>"
  }
  res.end(Email.buildTemplate(html));
});

// New user email
Picker.route('/email/new-user/:id?', function(params, req, res, next) {
  var html;
  var user = typeof params.id === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(params.id);
  var emailProperties = {
    profileUrl: Users.getProfileUrl(user),
    username: Users.getUserName(user)
  };
  html = Email.getTemplate('newUser')(emailProperties);
  res.end(Email.buildTemplate(html));
});

// Account approved email
Picker.route('/email/account-approved/:id?', function(params, req, res, next) {
  var user = typeof params.id === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(params.id);
  var emailProperties = {
    profileUrl: Users.getProfileUrl(user),
    username: Users.getUserName(user),
    siteTitle: Telescope.settings.get('title'),
    siteUrl: Telescope.utils.getSiteUrl()
  };
  var html = Email.getTemplate('accountApproved')(emailProperties);
  res.end(Email.buildTemplate(html));
});

// Newsletter email
Picker.route('/email/newsletter', function(params, req, res, next) {
  var campaign = Campaign.build(Campaign.getPosts(Telescope.settings.get('postsPerNewsletter', 5)));
  var campaignSubject = '<div class="campaign-subject"><strong>Subject:</strong> '+campaign.subject+' (note: contents might change)</div>';
  var campaignSchedule = '<div class="campaign-schedule"><strong>Scheduled for:</strong> '+ Meteor.call('getNextJob') +'</div>';
  res.end(campaignSubject+campaignSchedule+campaign.html);
});

// Newsletter confirmation email
Picker.route('/email/newsletter-confirmation', function(params, req, res, next) {
  var confirmationHtml = Email.getTemplate('newsletterConfirmation')({
    time: 'January 1st, 1901',
    newsletterLink: 'http://example.com',
    subject: 'Lorem ipsum dolor sit amet'
  });
  res.end(Email.buildTemplate(confirmationHtml));
});