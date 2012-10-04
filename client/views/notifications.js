Template.notifications.helpers({
	notifications: function(){
		var user=Meteor.user();
		if(Meteor.user() && !user.loading && user.profile && user.profile.notifications)
			return user.profile.notifications.sort(function(a,b) { return parseFloat(a.time) - parseFloat(b.time) } );

			// return sortJsonArrayByProperty(user.profile.notifications, 'time', -1);
	}
});