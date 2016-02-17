// Notification email
Picker.route('/email/campaign', function(params, req, res, next) {
  var campaign = buildCampaign(getCampaignPosts(Settings.get('postsPerNewsletter', 5)));
  var campaignSubject = '<div class="campaign-subject"><strong>Subject:</strong> '+campaign.subject+' (note: contents might change)</div>';
  var campaignSchedule = '<div class="campaign-schedule"><strong>Scheduled for:</strong> '+ Meteor.call('getNextJob') +'</div>';
  res.end(campaignSubject+campaignSchedule+campaign.html);
});

// Notification email
Picker.route('/email/digest-confirmation', function(params, req, res, next) {
  var confirmationHtml = Telescope.email.getTemplate('emailDigestConfirmation')({
    time: 'January 1st, 1901',
    newsletterLink: 'http://example.com',
    subject: 'Lorem ipsum dolor sit amet'
  });
  res.end(Telescope.email.buildTemplate(confirmationHtml));
});