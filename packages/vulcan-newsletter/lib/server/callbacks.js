import Users from 'meteor/vulcan:users';
import { addCallback, getSetting } from 'meteor/vulcan:core';
import Newsletters from '../modules/collection.js';

function subscribeUserOnProfileCompletion (user) {
  if (!!getSetting('autoSubscribe') && !!Users.getEmail(user)) {
    try {
      Newsletters.subscribeUser(user, false);
    } catch (error) {
      console.log("// Newsletter Error:") // eslint-disable-line
      console.log(error) // eslint-disable-line
    }
  }
  return user;
}
addCallback("users.profileCompleted.async", subscribeUserOnProfileCompletion);
