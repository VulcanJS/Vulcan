import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import NovaEmail from 'meteor/nova:email';

Telescope.notifications = {};

Telescope.notifications.create = (userIds, notificationName, data) => {

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
      console.log(`// Couldn't send notification: admin user ${user._id} doesn't have an email`);
    }
  });

};

if (typeof Telescope.settings.collection !== "undefined") {
  Telescope.settings.collection.addField({
    fieldName: 'emailNotifications',
    fieldSchema: {
      type: Boolean,
      optional: true,
      defaultValue: true,
      autoform: {
        group: 'notifications',
        instructions: 'Enable email notifications for new posts and new comments (requires restart).'
      }
    }
  });
}

