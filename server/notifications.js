notify= function(event, properties, userToNotify, userDoingAction){
	// console.log('adding new notification for:'+getDisplayName(userToNotify)+', for event:'+event);
	// console.log(userToNotify);
	// console.log(userDoingAction);
	// console.log(properties);
	if(userToNotify._id!=userDoingAction._id){
		// make sure we don't notify people of their own actions
		var notification= {
			timestamp: new Date().getTime(),
			userId: userToNotify._id,
			event: event,
			properties: properties,
			read: false
		}
		var newNotificationId=Notifications.insert(notification);
	}
};
markNotificationAsRead= function(notificationId){
	Notifications.update(
		{_id: notificationId},
		{
			$set:{
				read: true
			}
		},
		function(error, result){
			if(error){
				console.log(error);
			}	
		}
	);	
};
markAllNotificationsAsRead= function(user){
	Notifications.update(
		{userId: user._id},
		{
			$set:{
				read: true
			}
		},
		{multi: true},
		function(error, result){
			if(error){
				console.log(error);
			}	
		}
	);	
};
