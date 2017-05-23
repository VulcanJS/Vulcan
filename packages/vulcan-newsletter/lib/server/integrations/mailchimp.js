/* eslint-disable no-console */

// newsletter scheduling with MailChimp

import moment from 'moment';
import { getSetting } from 'meteor/vulcan:core';
import Newsletters from '../../modules/collection.js';
import MailChimpNPM from 'mailchimp';

/*

API

*/

const settings = getSetting('mailchimp');

if (settings) {
  
  const { apiKey, listId, fromName, fromEmail } = settings;
  const mailChimpAPI = new MailChimpNPM.MailChimpAPI(apiKey, { version : '2.0' });

  const callSyncAPI = ( section, method, options, callback ) => {
    const wrapped = Meteor.wrapAsync( mailChimpAPI.call, mailChimpAPI );
    return wrapped( section, method, options );
  };

  /*

  Methods

  */

  Newsletters.mailchimp = {

    // add a user to a MailChimp list.
    // called when a new user is created, or when an existing user fills in their email
    subscribe(email, confirm = false) {
      try {
        const subscribeOptions = {
          id: listId,
          email: {email: email},
          double_optin: confirm
        };
        // subscribe user
        const subscribe = callSyncAPI('lists', 'subscribe', subscribeOptions);
        return {result: 'subscribed', ...subscribe};
      } catch (error) {
        // if the email is already in the Mailchimp list, no need to throw an error
        if (error.message === "214") {
          return {result: 'already-subscribed'};
        }
        throw new Error("subscription-failed", error.message);
      }
    },

    // remove a user to a MailChimp list.
    // called from the user's account
    unsubscribe(email) {
      try {
        const subscribeOptions = {
          id: listId,
          email: {email: email},
          delete_member: true // delete the member from the list to make it possible for him to *resubscribe* via API (mailchimp's spam prevention policy)
        };
        // unsubscribe user
        const subscribe = callSyncAPI('lists', 'unsubscribe', subscribeOptions);
        return {result: 'unsubscribed', ...subscribe};
      } catch (error) {
        throw new Error("unsubscribe-failed", error.message);
      }
    },

    send({ title, subject, text, html, isTest = false }) {

      try {

        var campaignOptions = {
          type: 'regular',
          options: {
            list_id: listId,
            subject: subject,
            from_email: fromEmail,
            from_name: fromName
          },
          content: {
            html: html,
            text: text
          }
        };

        // create campaign
        const mailchimpNewsletter = callSyncAPI('campaigns', 'create', campaignOptions);

        console.log('// Newsletter created');
        // console.log(campaign)

        const scheduledMoment = moment().utcOffset(0).add(1, 'hours');
        const scheduledTime = scheduledMoment.format("YYYY-MM-DD HH:mm:ss");

        const scheduleOptions = {
          cid: mailchimpNewsletter.id,
          schedule_time: scheduledTime
        };

        // schedule campaign
        const schedule = callSyncAPI('campaigns', 'schedule', scheduleOptions); // eslint-disable-line

        console.log('// Newsletter scheduled for '+scheduledTime);

        return mailchimpNewsletter;

      } catch (error) {
        console.log(error);
        return false;
      }
    }

  }

}