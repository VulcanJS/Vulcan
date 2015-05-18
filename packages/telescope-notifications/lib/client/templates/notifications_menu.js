Template.notifications_menu.helpers({
  menuLabel: function () {
    var notificationsCount;
    var notifications=Herald.collection.find({userId: Meteor.userId(), read: false}, {sort: {timestamp: -1}}).fetch();

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
    var notifications=Herald.collection.find({userId: Meteor.userId(), read: false}, {sort: {timestamp: -1}}).fetch();
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
