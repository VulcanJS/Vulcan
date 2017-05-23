/*

This is a sample template for future integrations. 

*/

import { getSetting } from 'meteor/vulcan:core';
import Newsletters from '../../modules/collection.js';

/*

API

*/

const settings = getSetting('providerName');

if (settings) {

  const {server, apiKey, listId, somethingElse } = settings;
  const MyProviderAPI = new ProviderAPI(server, apiKey);

  const subscribeSync = options => {
    try {
      const wrapped = Meteor.wrapAsync( MyProviderAPI.subscribe, MyProviderAPI );
      return wrapped( options );
    } catch ( error ) {
      console.log(error)
    }
  };

  const unsubscribeSync = options => {
    try {
      const wrapped = Meteor.wrapAsync( MyProviderAPI.unsubscribe, MyProviderAPI );
      return wrapped( options );
    } catch ( error ) {
      console.log(error)
    }
  };

  const sendSync = options => {
    try {
      const wrapped = Meteor.wrapAsync( MyProviderAPI.send, MyProviderAPI );
      return wrapped( options );
    } catch ( error ) {
      console.log(error)
    }
  };

  /*

  Methods

  */

  Newsletters["providerName"] = {

    subscribe(email) {
      return subscribeSync({email});
    },

    unsubscribe(email) {
      return unsubscribeSync({email});
    },

    send({ title, subject, text, html, isTest = false }) {
      const options = {
        title,
        subject,
        text,
        html
      };
      return sendSync(options);
    }

  }

}