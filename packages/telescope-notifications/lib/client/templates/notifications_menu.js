var getNotifications = function () {
  return Herald.collection.find({userId: Meteor.userId(), read: false}, {sort: {timestamp: -1}}).fetch();
};

Template.notifications_menu.helpers({
  hasNotifications: function () {
    var notifications = getNotifications();
    return notifications.length;
  },
  menuLabel: function () {
    var notificationsCount;
    var notifications = getNotifications();

    if(notifications.length === 0){
      notificationsCount = __('no_notifications');
    }else if(notifications.length === 1){
      notificationsCount = __('1_notification');
    }else{
      notificationsCount = notifications.length+' '+ __('notifications');
    }

    return notificationsCount;
  },
  menuItems: function () {
    var notifications = getNotifications();
    var markAllAsRead = [{
      template: 'notifications_mark_as_read'
    }];
    var menuItems;
    if (notifications.length) {
      menuItems = markAllAsRead.concat(_.map(notifications, function (notification) {
        return {
          template: "notification_item",
          data: notification
        };
      }));
    } else {
      menuItems = [];
    }
    return menuItems;
  },
  menuMode: function () {
    if (!!this.mobile) {
      return 'list';
    } else if (Settings.get('navLayout', 'top-nav') === 'top-nav') {
      return 'dropdown';
    } else {
      return 'accordion';
    }
  }
});
