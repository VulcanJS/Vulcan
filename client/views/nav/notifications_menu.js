Template[getTemplate('notificationsMenu')].helpers({
  notificationItem: function () {
    return getTemplate('notificationItem');
  },
  notifications: function(){
    return Notifications.find({userId: Meteor.userId(), read: false}, {sort: {timestamp: -1}});
  },
  hasNotifications: function () {
    return !!Notifications.find({userId: Meteor.userId(), read: false}, {sort: {timestamp: -1}}).count();    
  },
  notification_count: function(){
    var notifications=Notifications.find({userId: Meteor.userId(), read: false}).fetch();
    if(notifications.length==0){
      return i18n.t('No notifications');
    }else if(notifications.length==1){
      return i18n.t('1 notification');
    }else{
      return notifications.length+' '+i18n.t('notifications');
    }
  },
  notification_class: function(){
    var notifications=Notifications.find({userId: Meteor.userId(), read: false}).fetch();
    if(notifications.length==0)
      return 'no-notifications';
  }
});

Template[getTemplate('notificationsMenu')].events({
  'click .notifications-toggle': function(e){
    e.preventDefault();
    $('body').toggleClass('notifications-open');
  },
  'click .mark-as-read': function(){
    Meteor.call('markAllNotificationsAsRead', 
      function(error, result){
        error && console.log(error);
      }
    );
  }
});