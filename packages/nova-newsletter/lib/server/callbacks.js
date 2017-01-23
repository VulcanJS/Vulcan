import MailChimpList from './mailchimp/mailchimp_list.js';
import Users from 'meteor/nova:users';
import { addCallback, getSetting } from 'meteor/nova:core';

function subscribeUserOnProfileCompletion (user) {
  if (!!getSetting('autoSubscribe') && !!Users.getEmail(user)) {
    try {
      MailChimpList.add(user, false, function (error, result) {
        console.log(error); // eslint-disable-line
        console.log(result); // eslint-disable-line
      });
    } catch (error) {
      console.log("// MailChimp Error:") // eslint-disable-line
      console.log(error) // eslint-disable-line
    }
  }
  return user;
}
addCallback("users.profileCompleted.async", subscribeUserOnProfileCompletion);
