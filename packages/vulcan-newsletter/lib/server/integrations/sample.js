/*

This is a sample template for future integrations. 

*/

import { getSetting, regiserSetting } from 'meteor/vulcan:core';
import Newsletters from '../../modules/collection.js';

regiserSetting('providerName');

/*

API

*/

const settings = getSetting('providerName');

if (settings) {

  const {server, apiKey, /* listId, somethingElse */ } = settings;
  // eslint-disable-next-line no-undef
  const MyProviderAPI = new ProviderAPI(server, apiKey);

  const subscribeSync = options => {
    try {
      const wrapped = Meteor.wrapAsync( MyProviderAPI.subscribe, MyProviderAPI );
      return wrapped( options );
    } catch ( error ) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const unsubscribeSync = options => {
    try {
      const wrapped = Meteor.wrapAsync( MyProviderAPI.unsubscribe, MyProviderAPI );
      return wrapped( options );
    } catch ( error ) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const sendSync = options => {
    try {
      const wrapped = Meteor.wrapAsync( MyProviderAPI.send, MyProviderAPI );
      return wrapped( options );
    } catch ( error ) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  /*

  Methods

  */

  Newsletters['providerName'] = {

    subscribe(email) {
      return subscribeSync({email});
    },

    unsubscribe(email) {
      return unsubscribeSync({email});
    },

    send({ subject, text, html, isTest = false }) {
      const options = {
        subject,
        text,
        html
      };
      return sendSync(options);
    }

  }

}