import Users from 'meteor/vulcan:users';
import { addCallback, getSetting, registerSetting } from 'meteor/vulcan:core';
import Newsletters from '../modules/collection.js';

registerSetting('newsletter.autoSubscribe', false, 'Automatically subscribe every new user to your newsletter');

function subscribeUserOnProfileCompletion (user) {
  if (!!getSetting('newsletter.autoSubscribe') && !!Users.getEmail(user)) {
    try {
      Newsletters.subscribeUser(user, false);
    } catch (error) {
      console.log('// Newsletter Error:') // eslint-disable-line
      console.log(error) // eslint-disable-line
    }
  }
  return user;
}
addCallback('users.profileCompleted.async', subscribeUserOnProfileCompletion);
