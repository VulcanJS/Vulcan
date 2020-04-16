/* eslint-disable no-console */

// newsletter scheduling with MailChimp

import moment from 'moment';
import { getSetting, registerSetting, throwError } from 'meteor/vulcan:core';
import Newsletters from '../../modules/collection.js';
import Mailchimp from 'mailchimp-api-v3';

registerSetting('mailchimp', null, 'MailChimp settings');

/*

API

*/

const settings = getSetting('mailchimp');

if (settings) {
  const { apiKey, listId, fromName, fromEmail } = settings;

  var mailchimp = new Mailchimp(apiKey);

  // const mailChimpAPI = new MailChimpNPM.MailChimpAPI(apiKey, { version : '2.0' });

  // const callSyncAPI = ( section, method, options, callback ) => {
  //   const wrapped = Meteor.wrapAsync( mailChimpAPI.call, mailChimpAPI );
  //   return wrapped( section, method, options );
  // };

  /*

  Methods

  */

  Newsletters.mailchimp = {
    // add a user to a MailChimp list.
    // called when a new user is created, or when an existing user fills in their email
    async subscribe(email, confirm = false) {
      try {
        const subscribeOptions = {
          email_address: email,
          status: 'subscribed',
        };
        // subscribe user
        const subscribe = await mailchimp.post(`/lists/${listId}/members`, subscribeOptions);
        // const subscribe = callSyncAPI('lists', 'subscribe', subscribeOptions);
        return { result: 'subscribed', ...subscribe };
      } catch (error) {
        console.log(error);
        let name;
        const message = error.message;
        if (error.code == 214) {
          name = 'has_unsubscribed';
          //} else if (error.code != 214) { // TODO should get the right code for already_subscribed
          //  name = 'already_subscribed';
        } else {
          name = 'subscription_failed';
        }
        throwError({ id: name, message, data: { path: 'newsletter_subscribeToNewsletter', message } });
      }
    },

    // remove a user to a MailChimp list.
    // called from the user's account
    async unsubscribe(email) {
      try {
        const subscribeOptions = {
          email_address: email,
          status: 'unsubscribed',
        };
        // unsubscribe user
        const subscribe = await mailchimp.post(`/lists/${listId}/members`, subscribeOptions);
        return { result: 'unsubscribed', ...subscribe };
      } catch (error) {
        throw new Error('unsubscribe-failed', error.message);
      }
    },

    async send({ subject, text, html, isTest = false }) {
      const campaignCreationOptions = {
        type: 'regular',
        recipients: {
          list_id: listId,
        },
        settings: {
          subject_line: subject,
          title: subject,
          reply_to: fromEmail,
          from_name: fromName,
        },
        // content: {
        //   html: html,
        //   text: text,
        // },
      };

      // create campaign
      const createdCampaign = await mailchimp.post('campaigns', campaignCreationOptions);

      const campaignContentOptions = {
        html: html,
        plain_text: text,
      };

      // eslint-disable-next-line
      const editedCampaign = await mailchimp.put(`/campaigns/${createdCampaign.id}/content`, campaignContentOptions);

      const scheduledMoment = moment()
        .utcOffset(0)
        .add(1, 'hours');

      // note: we always schedule on the hour
      const scheduledTime = scheduledMoment.format('YYYY-MM-DDTHH:00:00');

      const scheduleOptions = {
        schedule_time: scheduledTime,
      };

      // schedule campaign
      const scheduledCampaign = await mailchimp.post(`/campaigns/${createdCampaign.id}/actions/schedule`, scheduleOptions);

      console.log('// Newsletter scheduled for ' + scheduledTime);
      console.log(scheduledCampaign);

      return scheduledCampaign;
    },
  };
}
