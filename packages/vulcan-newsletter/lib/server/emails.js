import VulcanEmail from 'meteor/vulcan:email';
import Newsletters from "../modules/collection.js";
import { getSetting } from 'meteor/vulcan:core';

// Extend email objects with server-only properties

VulcanEmail.emails.newsletter = {

  ...VulcanEmail.emails.newsletter, 

  getNewsletter() {
    return Newsletters.build(Newsletters.getPosts(getSetting('postsPerNewsletter', 5)));
  },

  subject() {
    return this.getNewsletter().subject;
  },

  getTestHTML() {
    var campaign = this.getNewsletter();
    var newsletterEnabled = `<div class="newsletter-enabled"><strong>Newsletter Enabled:</strong> ${getSetting('enableNewsletter', true)}</div>`;
    var campaignSubject = `<div class="campaign-subject"><strong>Subject:</strong> ${campaign.subject} (note: contents might change)</div>`;
    var campaignSchedule = `<div class="campaign-schedule"><strong>Scheduled for:</strong> ${Newsletters.getNext()}</div>`;
    return newsletterEnabled+campaignSubject+campaignSchedule+campaign.html;
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