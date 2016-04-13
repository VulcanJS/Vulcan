// Campaign object is only available on server, so define actions on server only

import Campaign from "./campaign.js";

_.findWhere(Telescope.email.routes, {name: "Newsletter"}).action= (params, req, res, next) => {
  var campaign = Campaign.build(Campaign.getPosts(Telescope.settings.get('postsPerNewsletter', 5)));
  var newsletterEnabled = '<div class="newsletter-enabled"><strong>Newsletter Enabled:</strong> '+Telescope.settings.get('enableNewsletter', true)+'</div>';
  var mailChimpAPIKey = '<div class="mailChimpAPIKey"><strong>mailChimpAPIKey:</strong> '+(typeof Telescope.settings.get('mailChimpAPIKey') !== "undefined")+'</div>';
  var mailChimpListId = '<div class="mailChimpListId"><strong>mailChimpListId:</strong> '+(typeof Telescope.settings.get('mailChimpListId') !== "undefined")+'</div>';
  var campaignSubject = '<div class="campaign-subject"><strong>Subject:</strong> '+campaign.subject+' (note: contents might change)</div>';
  var campaignSchedule = '<div class="campaign-schedule"><strong>Scheduled for:</strong> '+ Meteor.call('getNextJob') +'</div>';
  res.end(newsletterEnabled+mailChimpAPIKey+mailChimpListId+campaignSubject+campaignSchedule+campaign.html);
}

_.findWhere(Telescope.email.routes, {name: "Newsletter Confirmation"}).action= (params, req, res, next) => {
  var confirmationHtml = Telescope.email.getTemplate('newsletterConfirmation')({
    time: 'January 1st, 1901',
    newsletterLink: 'http://example.com',
    subject: 'Lorem ipsum dolor sit amet'
  });
  res.end(Telescope.email.buildTemplate(confirmationHtml));
}