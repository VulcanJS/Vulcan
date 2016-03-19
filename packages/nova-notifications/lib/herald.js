import Email from 'meteor/nova:email';

Telescope.notifications = {};

// send emails every second when in dev environment
if (Meteor.absoluteUrl().indexOf('localhost') !== -1)
  Herald.settings.queueTimer = 1000;

Meteor.startup(function () {

  // set up couriers
  _.each(Telescope.notifications, function (notification, notificationName) {

    var courier = {
      media: {
        email: {
          emailRunner: function (user) {
            var properties = notification.properties.call(this);
            var subject = notification.subject.call(properties);
            var html = Email.buildTemplate(Email.getTemplate(notification.emailTemplate)(properties));
            Email.send(Users.getEmail(user), subject, html);
          }
        }
      }
    };

    if (!!notification.onsiteTemplate) {
      courier.media.onsite = {};
      courier.message = function () {
        var properties = notification.properties.call(this);
        return Blaze.toHTML(Blaze.With(properties, function () {
          return Template[notification.onsiteTemplate];
        }));
      };
    }

    Herald.addCourier(notificationName, courier);

  });

  Herald.collection.deny({
    update: function(){ return !Users.can.editById; },
    remove: function(){ return !Users.can.editById; }
  });

  // disable all email notifications when "emailNotifications" is set to false
  Herald.settings.overrides.email = !Telescope.settings.get('emailNotifications', true);

});

if (typeof Settings !== "undefined") {
  Settings.addField({
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

