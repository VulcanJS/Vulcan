import Users from 'meteor/vulcan:users';
import VulcanEmail from 'meteor/vulcan:email';
import { getSetting } from 'meteor/vulcan:core';

export const createNotification = (userIds, notificationName, data) => {

  if (getSetting('emailNotifications', true)) {
    // if userIds is not an array, wrap it in one
    if (!Array.isArray(userIds)) userIds = [userIds];

    const email = VulcanEmail.emails[notificationName];

    userIds.forEach(userId => {
      const to = Users.getEmail(Users.findOne(userId));
      if (to) {
        VulcanEmail.buildAndSend({ to, email, data });
      } else {
        console.log(`// Couldn't send notification: admin user ${user._id} doesn't have an email`); // eslint-disable-line
      }
    });
  }

};
