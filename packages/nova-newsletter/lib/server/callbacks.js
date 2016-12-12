import Telescope from 'meteor/nova:lib';
import MailChimpList from './mailchimp/mailchimp_list.js';
import Users from 'meteor/nova:users';
import { Callbacks } from 'meteor/nova:core';

function subscribeUserOnProfileCompletion (user) {
  if (!!Telescope.settings.get('autoSubscribe') && !!Users.getEmail(user)) {
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
Callbacks.add("users.profileCompleted.async", subscribeUserOnProfileCompletion);
