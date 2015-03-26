Template[getTemplate('notificationsMenu')].helpers({
  notifications: function(){

    if (!!this.mobile) {
      var dropdownMode = 'list';
    } else if (getSetting('navLayout', 'top-nav') === 'top-nav') {
      var dropdownMode = 'hover';
    } else {
      var dropdownMode = 'accordion';
    }

    var notificationsCount;
    var notifications=Herald.collection.find({userId: Meteor.userId(), read: false}, {sort: {timestamp: -1}}).fetch();
    
    if(notifications.length==0){
      notificationsCount = __('no_notifications');
    }else if(notifications.length==1){
      notificationsCount = __('1_notification');
    }else{
      notificationsCount = notifications.length+' '+__('notifications');
    }

    var markAllAsRead = [{
      template: 'notificationsMarkAsRead'
    }];

    if (notifications.length) {
      var dropdownItems = markAllAsRead.concat(_.map(notifications, function (notification) {
        return {
          template: "notificationItem",
          data: notification
        }
      }));
    } else {
      var dropdownItems = [];
    }

    return {
      dropdownName: 'notifications',
      dropdownLabel: notificationsCount,
      dropdownItems: dropdownItems,
      dropdownClass: 'header-submodule',
      dropdownMode: dropdownMode
    }
  }
});