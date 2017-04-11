import Sendy from 'sendy-api'; // see https://github.com/igord/sendy-api
import { getSetting } from 'meteor/vulcan:core';
import Newsletters from '../../modules/collection.js';

/*

API

*/

const {server, apiKey, listId, fromName, fromEmail, replyTo } = getSetting('sendy');

const SendyAPI = new Sendy(server, apiKey);

/*

Methods

*/

Newsletters.sendy = {

  subscribe(email) {
    SendyAPI.subscribe({email, list_id: listId}, function(err, result) {
      if (err) console.log(err.toString());
      else console.log('Success: ' + result);
    });
  },

  unsubscribe(email) {
    SendyAPI.unsubscribe({email, list_id: listId}, function(err, result) {
      if (err) console.log(err.toString());
      else console.log('Success: ' + result);
    });
  },

  send({ title, subject, text, html, isTest = false }) {

    const params = {
        from_name: fromName,
        from_email: fromEmail,
        reply_to: replyTo,
        subject: subject,
        plain_text: text,
        html_text: html,
        send_campaign: !isTest,
        list_ids: listId
    };

    console.log(params);
    
    SendyAPI.createCampaign(params, function(err,result){
      if (err) {
        console.log('// Sendy error')
        console.log(err)
      } else {
        console.log(result)
      }
    });

  }

}