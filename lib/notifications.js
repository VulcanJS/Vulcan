Meteor.methods({
	addNotification: function(event, properties, userToNotify, userDoingAction){
		console.log('adding new notification for:'+getDisplayName(userToNotify)+', for event:'+event);
		console.log(userToNotify);
		console.log(userDoingAction);
		console.log(properties);
		if(userToNotify._id!=userDoingAction._id){
			// make sure we don't notify people of their own actions
			Meteor.users.update(
				{_id: userToNotify._id},
				{$push: 
					{
						'profile.notifications': {
							timestamp: new Date().getTime(),
							event: event,
							properties: properties,
							read: false
						}
					}
				},
				function(error, result){
					if(error){
						console.log(error);
					}	
				}
			);
		}
	},
	clearNotifications: function(user){
		Meteor.users.update(
			{_id: user._id},
			{$pull: 
				{
					'profile.notifications': {}
				}
			},
			function(error, result){
				if(error){
					console.log(error);
	
				}	
			}
		);	
	}
});