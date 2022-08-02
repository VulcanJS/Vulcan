/* eslint-disable no-console */

// newsletter scheduling with MailChimp

import moment from 'moment';
import { getSetting, registerSetting, throwError } from 'meteor/vulcan:core';
import Newsletters from '../../modules/collection.js';
import fetch from 'node-fetch';

registerSetting('emailoctopus', null, 'EmailOctopus settings');

/*

API

*/

const settings = getSetting('emailoctopus');

if (settings) {
  const { apiKey, listId, fromName, fromEmail } = settings;

  /*

  Methods

  */

  Newsletters.emailoctopus = {
    // add a user to a MailChimp list.
    // called when a new user is created, or when an existing user fills in their email
    async subscribe(email, confirm = false) {

      try {
        // subscribe user
        const body = {
          api_key: apiKey,
          email_address: email,
          // status: 'SUBSCRIBED'
        }
        const subscribe = await fetch(`https://emailoctopus.com/api/1.5/lists/${listId}/contacts`, {
          method: 'post',
          body: JSON.stringify(body),
          headers: {'Content-Type': 'application/json'}
        });
        const json = await subscribe.json();
        if (json.error) {
          throw json.error;
        }
        // const subscribe = await mailchimp.post(`/lists/${listId}/members`, subscribeOptions);
        // const subscribe = callSyncAPI('lists', 'subscribe', subscribeOptions);
        return { result: 'subscribed', ...json };
      } catch (error) {
        const name = error.code;
        const message = error.message;
        throwError({ id: name, message, data: { path: 'newsletter_subscribeToNewsletter', message } });
      }
    },

    // remove a user to a MailChimp list.
    // called from the user's account
    async unsubscribe(email) {
      // not available
      throw Error(`Unsubscribe not implemented yet`);
    },

    async send({ subject, text, html, isTest = false }) {
      // not available
      throw Error(`EmailOctopus API doesn't support sending campaigns currently (June 2020)`);
    },
  };
}
