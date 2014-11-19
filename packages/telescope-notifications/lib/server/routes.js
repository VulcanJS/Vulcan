Meteor.startup(function () {
  
  // Notification email

  Router.route('/email/notification/:id?', {
    name: 'notification',
    where: 'server',
    action: function() {
      var notification = Notifications.findOne(this.params.id);
      var notificationContents = buildEmailNotification(notification);
      this.response.write(notificationContents.html);
      this.response.end();
    }
  });

});