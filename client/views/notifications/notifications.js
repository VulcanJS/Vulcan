Template[getTemplate('notifications')].helpers({
  notification_item: function () {
    return getTemplate('notification_item');
  },
  notifications: function(){
    return Notifications.find({userId: Meteor.userId()}, {sort: {timestamp: -1}});
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

Template[getTemplate('notifications')].events({
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
})
