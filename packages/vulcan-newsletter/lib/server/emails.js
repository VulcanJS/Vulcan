import VulcanEmail from 'meteor/vulcan:email';
import Newsletter from "../namespace.js";
import { getSetting } from 'meteor/vulcan:core';

// Extend email objects with server-only properties

VulcanEmail.emails.newsletter = {

  ...VulcanEmail.emails.newsletter, 

  getNewsletter() {
    return Newsletter.build(Newsletter.getPosts(getSetting('postsPerNewsletter', 5)));
  },

  subject() {
    return this.getNewsletter().subject;
  },

  getTestHTML() {
    var campaign = this.getNewsletter();
    var newsletterEnabled = '<div class="newsletter-enabled"><strong>Newsletter Enabled:</strong> '+getSetting('enableNewsletter', true)+'</div>';
    var mailChimpAPIKey = '<div class="mailChimpAPIKey"><strong>mailChimpAPIKey:</strong> '+(typeof getSetting('mailChimpAPIKey') !== "undefined")+'</div>';
    var mailChimpListId = '<div class="mailChimpListId"><strong>mailChimpListId:</strong> '+(typeof getSetting('mailChimpListId') !== "undefined")+'</div>';
    var campaignSubject = '<div class="campaign-subject"><strong>Subject:</strong> '+campaign.subject+' (note: contents might change)</div>';
    var campaignSchedule = '<div class="campaign-schedule"><strong>Scheduled for:</strong> '+ Meteor.call('getNextJob') +'</div>';
    return newsletterEnabled+mailChimpAPIKey+mailChimpListId+campaignSubject+campaignSchedule+campaign.html;
  }

};

VulcanEmail.emails.newsletterConfirmation = {

  ...VulcanEmail.emails.newsletterConfirmation, 

  getTestHTML() {
    return VulcanEmail.getTemplate('newsletterConfirmation')({
      time: 'January 1st, 1901',
      newsletterLink: 'http://example.com',
      subject: 'Lorem ipsum dolor sit amet'
    });
  }

};