import Users from 'meteor/vulcan:users';
import VulcanEmail from 'meteor/vulcan:email';
import { getSetting } from 'meteor/vulcan:core';

export const createNotification = (userIds, notificationName, data) => {

  if (getSetting('emailNotifications', true)) {
    // if userIds is not an array, wrap it in one
    if (!Array.isArray(userIds)) userIds = [userIds];

    userIds.forEach(userId => {

      const user = Users.findOne(userId);
      const email = VulcanEmail.emails[notificationName];
      const properties = email.getProperties(data);
      const subject = email.subject(properties);
      const html = VulcanEmail.getTemplate(email.template)(properties);

      const userEmail = Users.getEmail(user);
      if (!!userEmail) {
        VulcanEmail.buildAndSendHTML(Users.getEmail(user), subject, html);
      } else {
        console.log(`// Couldn't send notification: admin user ${user._id} doesn't have an email`); // eslint-disable-line
      }
    });
  }

};
