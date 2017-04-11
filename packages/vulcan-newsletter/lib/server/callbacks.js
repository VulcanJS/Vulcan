import Users from 'meteor/vulcan:users';
import { addCallback, getSetting } from 'meteor/vulcan:core';
import Newsletters from '../modules/collection.js';

function subscribeUserOnProfileCompletion (user) {
  if (!!getSetting('autoSubscribe') && !!Users.getEmail(user)) {
    try {
      Newsletters.subscribe(user, false, function (error, result) {
        console.log(error); // eslint-disable-line
        console.log(result); // eslint-disable-line
      });
    } catch (error) {
      console.log("// Newsletter Error:") // eslint-disable-line
      console.log(error) // eslint-disable-line
    }
  }
  return user;
}
addCallback("users.profileCompleted.async", subscribeUserOnProfileCompletion);
