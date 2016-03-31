import Novamail from 'meteor/nova:email';
import Campaign from 'meteor/nova:newsletter';

import emailTemplates from './templates.js';

// assign templates to Novamail
Novamail.addTemplates(emailTemplates);

// New post email
Picker.route('/email/new-post/:id?', function(params, req, res, next) {
  var html;
  var post = typeof params.id === "undefined" ? Posts.findOne() : Posts.findOne(params.id);

  if (!!post) {
    html = Novamail.getTemplate('newPost')(Posts.getNotificationProperties(post));
  } else {
    html = "<h3>No post found.</h3>";
  }
  res.end(Novamail.buildTemplate(html));
});

// Post approved
Picker.route('/email/post-approved/:id?', function(params, req, res, next) {
  var html;
  var post = typeof params.id === "undefined" ? Posts.findOne() : Posts.findOne(params.id);
  if (!!post) {
    html = Novamail.getTemplate('postApproved')(Posts.getNotificationProperties(post));
  } else {
    html = "<h3>No post found.</h3>";
  }
  res.end(Novamail.buildTemplate(html));
});

// New comment email
Picker.route('/email/new-comment/:id?', function(params, req, res, next) {
  var html;
  var comment = typeof params.id === "undefined" ? Comments.findOne() : Comments.findOne(params.id);
  var post = Posts.findOne(comment.postId);
  if (!!comment) {
    html = Novamail.getTemplate('newComment')(Comments.getNotificationProperties(comment, post));
  } else {
    html = "<h3>No post found.</h3>";
  }
  res.end(Novamail.buildTemplate(html));
});

// New reply email
Picker.route('/email/new-reply/:id?', function(params, req, res, next) {
  var html;
  var comment = typeof params.id === "undefined" ? Comments.findOne() : Comments.findOne(params.id);
  var post = Posts.findOne(comment.postId);
  if (!!comment) {
    html = Novamail.getTemplate('newReply')(Comments.getNotificationProperties(comment, post));
  } else {
    html = "<h3>No post found.</h3>";
  }
  res.end(Novamail.buildTemplate(html));
});

// New user email
Picker.route('/email/new-user/:id?', function(params, req, res, next) {
  var html;
  var user = typeof params.id === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(params.id);
  var emailProperties = {
    profileUrl: Users.getProfileUrl(user),
    username: Users.getUserName(user)
  };
  html = Novamail.getTemplate('newUser')(emailProperties);
  res.end(Novamail.buildTemplate(html));
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
  var html = Novamail.getTemplate('accountApproved')(emailProperties);
  res.end(Novamail.buildTemplate(html));
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
  var confirmationHtml = Novamail.getTemplate('newsletterConfirmation')({
    time: 'January 1st, 1901',
    newsletterLink: 'http://example.com',
    subject: 'Lorem ipsum dolor sit amet'
  });
  res.end(Novamail.buildTemplate(confirmationHtml));
});

Picker.route('/email/test', function (params, req, res, next) {
  Novamail.buildAndSend(Telescope.settings.get('defaultEmail'), 'Nova email test', 'test', {date: new Date()});
  res.end('email sent');
});