import MailChimpList from './mailchimp.js';

function subscribeUserOnProfileCompletion (user) {
  if (!!Telescope.settings.get('autoSubscribe') && !!Users.getEmail(user)) {
    MailChimpList.add(user, false, function (error, result) {
      console.log(error);
      console.log(result);
    });
  }
  return user;
}
Telescope.callbacks.add("profileCompletedAsync", subscribeUserOnProfileCompletion);