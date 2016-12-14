import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import NovaEmail from 'meteor/nova:email';
import { getSetting } from 'meteor/nova:core';

Telescope.notifications = {};

Telescope.notifications.create = (userIds, notificationName, data) => {

  if (getSetting('enableNotifications', true)) {
    // if userIds is not an array, wrap it in one
    if (!Array.isArray(userIds)) userIds = [userIds];

    userIds.forEach(userId => {

      const user = Users.findOne(userId);
      const email = NovaEmail.emails[notificationName];
      const properties = email.getProperties(data);
      const subject = email.subject(properties);
      const html = NovaEmail.getTemplate(email.template)(properties);

      const userEmail = Users.getEmail(user);
      if (!!userEmail) {
        NovaEmail.buildAndSendHTML(Users.getEmail(user), subject, html);
      } else {
        console.log(`// Couldn't send notification: admin user ${user._id} doesn't have an email`); // eslint-disable-line
      }
    });
  }

};

// settings collection is deprecated
// if (typeof Telescope.settings.collection !== "undefined") {
//   Telescope.settings.collection.addField({
//     fieldName: 'emailNotifications',
//     fieldSchema: {
//       type: Boolean,
//       optional: true,
//       defaultValue: true,
//       form: {
//         group: 'notifications',
//         instructions: 'Enable email notifications for new posts and new comments (requires restart).'
//       }
//     }
//   });
// }

