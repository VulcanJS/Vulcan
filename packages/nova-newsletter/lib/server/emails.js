// Campaign object is only available on server, so define actions on server only

import Campaign from "./campaign.js";

Telescope.email.emails.newsletter = Object.assign(Telescope.email.emails.newsletter, {

  getCampaign() {
    return Campaign.build(Campaign.getPosts(Telescope.settings.get('postsPerNewsletter', 5)));
  },

  subject() {
    return this.getCampaign().subject;
  },

  getTestHTML() {
    var campaign = this.getCampaign();
    var newsletterEnabled = '<div class="newsletter-enabled"><strong>Newsletter Enabled:</strong> '+Telescope.settings.get('enableNewsletter', true)+'</div>';
    var mailChimpAPIKey = '<div class="mailChimpAPIKey"><strong>mailChimpAPIKey:</strong> '+(typeof Telescope.settings.get('mailChimpAPIKey') !== "undefined")+'</div>';
    var mailChimpListId = '<div class="mailChimpListId"><strong>mailChimpListId:</strong> '+(typeof Telescope.settings.get('mailChimpListId') !== "undefined")+'</div>';
    var campaignSubject = '<div class="campaign-subject"><strong>Subject:</strong> '+campaign.subject+' (note: contents might change)</div>';
    var campaignSchedule = '<div class="campaign-schedule"><strong>Scheduled for:</strong> '+ Meteor.call('getNextJob') +'</div>';
    return newsletterEnabled+mailChimpAPIKey+mailChimpListId+campaignSubject+campaignSchedule+campaign.html;
  }

});

Telescope.email.emails.newsletterConfirmation = Object.assign(Telescope.email.emails.newsletterConfirmation, {

  getTestHTML() {
    return Telescope.email.getTemplate('newsletterConfirmation')({
      time: 'January 1st, 1901',
      newsletterLink: 'http://example.com',
      subject: 'Lorem ipsum dolor sit amet'
    });
  }

});