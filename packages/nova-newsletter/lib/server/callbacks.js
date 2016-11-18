import Telescope from 'meteor/nova:lib';
import MailChimpList from './mailchimp/mailchimp_list.js';
import Users from 'meteor/nova:users';

function subscribeUserOnProfileCompletion (user) {
  if (!!Telescope.settings.get('autoSubscribe') && !!Users.getEmail(user)) {
    MailChimpList.add(user, false, function (error, result) {
      console.log(error); // eslint-disable-line
      console.log(result); // eslint-disable-line
    });
  }
  return user;
}
Telescope.callbacks.add("users.profileCompleted.async", subscribeUserOnProfileCompletion);
