Template.notifications.helpers({
  notifications: function(){
    var user=Meteor.user();
    if(user && !user.loading)
      return user.notifications;
  },
  notification_count: function(){
  	var user=Meteor.user();
  	if(!user.notifications || user.notifications.length==0){
  		return 'No notifications';
  	}else if(user.notifications.length==1){
  		return '1 notification';
  	}else{
  		return user.notifications.length+' notifications';
  	}
  },
  notification_class: function(){
  	var user=Meteor.user();
  	if(!user.notifications || user.notifications.length==0)
  		return 'no-notifications';
  }
});

Template.notifications.events({
	'click .notifications-toggle': function(){
		$('body').toggleClass('notifications-open');
	},
	'click .clear-notifications': function(){
		Meteor.call('clearNotifications', Meteor.user());
	}
})