import Users from 'meteor/nova:users';
import MailChimp from './mailchimp_api.js';
import { getSetting } from 'meteor/nova:core';

const MailChimpList = {};

MailChimpList.add = function(userOrEmail, confirm, done){

  var apiKey = getSetting('mailChimpAPIKey');
  var listId = getSetting('mailChimpListId');

  var user, email;

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

      var api = new MailChimp(apiKey);
      var subscribeOptions = {
        id: listId,
        email: {"email": email},
        double_optin: confirm
      };

      // subscribe user
      var subscribe = api.call('lists', 'subscribe', subscribeOptions);

      // mark user as subscribed
      if (!!user) {
        Users.setSetting(user, 'newsletter_subscribeToNewsletter', true);
      }

      console.log("// User subscribed"); // eslint-disable-line

      return {actionResult: 'subscribed', ...subscribe};

    } catch (error) {
      // if the email is already in the Mailchimp list, no need to throw an error
      if (error.error === 214) {
        console.log('// Email already present in the list!');
        
        // if this is a user subscribing, update the relevant setting
        if (user) {
          Users.setSetting(user, 'newsletter_subscribeToNewsletter', true);
          console.log('// User setting updated');
        }
        
        return {actionResult: 'subscribed'};
      }
      
      throw new Meteor.Error("subscription-failed", error.message);
    }
  } else {
    throw new Meteor.Error("Please provide your MailChimp API key and list ID");
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

      var api = new MailChimp(apiKey);
      var subscribeOptions = {
        id: listId,
        email: {"email": email},
        delete_member: true // delete the member from the list to make it possible for him to *resubscribe* via API (mailchimp's spam prevention policy)
      };

      // unsubscribe user
      var subscribe = api.call('lists', 'unsubscribe', subscribeOptions);

      // mark user as unsubscribed
      Users.setSetting(user, 'newsletter_subscribeToNewsletter', false);

      console.log("// User unsubscribed"); // eslint-disable-line

      return {actionResult: 'unsubscribed', ...subscribe};

    } catch (error) {
      throw new Meteor.Error("unsubscription-failed", error.message);
    }
  } else {
    throw new Meteor.Error("Please provide your MailChimp API key and list ID");
  }
};

export default MailChimpList;
