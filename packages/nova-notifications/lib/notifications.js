// import Email from 'meteor/nova:email';

Telescope.notifications = {};

Telescope.createNotification = (userIds, notificationName, data) => {

  // if userIds is not an array, wrap it in one
  if (!Array.isArray(userIds)) userIds = [userIds];

  userIds.forEach(userId => {

    const user = Users.findOne(userId);
    const notification = Telescope.notifications[notificationName];
    const properties = notification.properties(data);
    const subject = notification.subject(properties);
    const html = Telescope.email.buildTemplate(Telescope.email.getTemplate(notification.emailTemplate)(properties));

    Telescope.email.send(Users.getEmail(user), subject, html);
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

