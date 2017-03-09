import Users from 'meteor/nova:users';
import MailChimp from './mailchimp_api.js';
import { getSetting } from 'meteor/nova:core';

const MailChimpList = {};

MailChimpList.add = function(userOrEmail, confirm, done){

  const apiKey = getSetting('mailChimpAPIKey');
  const listId = getSetting('mailChimpListId');

  let user, email;

  confirm = (typeof confirm === 'undefined') ? false : confirm; // default to no confirmation
  
  // not sure if it's really necessary that the function take both user and email?
  if (typeof userOrEmail === "string") {
    user = null;
    email = userOrEmail;
  } else if (typeof userOrEmail === "object") {
    user = userOrEmail;
    email = Users.getEmail(user);
    if (!email)
      throw 'User must have an email address';
  }

  // add a user to a MailChimp list.
  // called when a new user is created, or when an existing user fills in their email
  if(!!apiKey && !!listId){

    try {

      console.log('// Adding "'+email+'" to MailChimp list…'); // eslint-disable-line

      const api = new MailChimp(apiKey);
      const subscribeOptions = {
        id: listId,
        email: {"email": email},
        double_optin: confirm
      };

      // subscribe user
      const subscribe = api.call('lists', 'subscribe', subscribeOptions);

      // mark user as subscribed
      if (!!user) {
        Users.setSetting(user, 'newsletter_subscribeToNewsletter', true);
      }

      console.log("// User subscribed"); // eslint-disable-line

      return {actionResult: 'subscribed', ...subscribe};

    } catch (error) {
      // if the email is already in the Mailchimp list, no need to throw an error
      if (error.message === "214") {
        console.log('// Email already present in the list!');  // eslint-disable-line
        
        // if this is a user subscribing, update the relevant setting
        if (user) {
          Users.setSetting(user, 'newsletter_subscribeToNewsletter', true);
          console.log('// User setting updated'); // eslint-disable-line
        }
        
        return {actionResult: 'subscribed'};
      }
      
      throw new Error("subscription-failed", error.message);
    }
  } else {
    throw new Error("Please provide your MailChimp API key and list ID");
  }
};

MailChimpList.remove = (user) => {
  const apiKey = getSetting('mailChimpAPIKey');
  const listId = getSetting('mailChimpListId');

  const email = Users.getEmail(user);
  if (!email) {
    throw 'User must have an email address';
  }

  // remove a user to a MailChimp list.
  // called from the user's account
  if(!!apiKey && !!listId){

    try {

      console.log('// Removing "'+email+'" from MailChimp list…'); // eslint-disable-line

      const api = new MailChimp(apiKey);
      const subscribeOptions = {
        id: listId,
        email: {"email": email},
        delete_member: true // delete the member from the list to make it possible for him to *resubscribe* via API (mailchimp's spam prevention policy)
      };

      // unsubscribe user
      const subscribe = api.call('lists', 'unsubscribe', subscribeOptions);

      // mark user as unsubscribed
      Users.setSetting(user, 'newsletter_subscribeToNewsletter', false);

      console.log("// User unsubscribed"); // eslint-disable-line

      return {actionResult: 'unsubscribed', ...subscribe};

    } catch (error) {
      throw new Error("unsubscription-failed", error.message);
    }
  } else {
    throw new Error("Please provide your MailChimp API key and list ID");
  }
};

export default MailChimpList;
