import Sendy from 'sendy-api'; // see https://github.com/igord/sendy-api
import { getSetting } from 'meteor/vulcan:core';
import Newsletters from '../../modules/collection.js';

/*

API

*/

const {server, apiKey, listId, fromName, fromEmail, replyTo } = getSetting('sendy');

const SendyAPI = new Sendy(server, apiKey);

const subscribeSync = function ( options ) {
  try {
    const wrapped = Meteor.wrapAsync( SendyAPI.subscribe, SendyAPI );
    return wrapped( options );
  } catch ( error ) {
    console.log('// Sendy API error')
    console.log(error)
    if (error.message === 'Already subscribed.') {
      return {result: 'already-subscribed'}
    }
  }
};

const unsubscribeSync = function ( options ) {
  try {
    const wrapped = Meteor.wrapAsync( SendyAPI.unsubscribe, SendyAPI );
    return wrapped( options );
  } catch ( error ) {
    console.log('// Sendy API error')
    console.log(error)
  }
};

const createCampaignSync = function ( options ) {
  try {
    const wrapped = Meteor.wrapAsync( SendyAPI.createCampaign, SendyAPI );
    return wrapped( options );
  } catch ( error ) {
    console.log('// Sendy API error')
    console.log(error)
  }
};

/*

Methods

*/

Newsletters.sendy = {

  subscribe(email) {
    return subscribeSync({email, list_id: listId});
  },

  unsubscribe(email) {
    return unsubscribeSync({email, list_id: listId});
  },

  send({ title, subject, text, html, isTest = false }) {
    const params = {
      from_name: fromName,
      from_email: fromEmail,
      reply_to: replyTo,
      title: subject,
      subject: subject,
      plain_text: text,
      html_text: html,
      send_campaign: !isTest,
      list_ids: listId
    };
    return createCampaignSync(params);
  }

}