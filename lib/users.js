getDisplayNameById = function(userId){
	getDisplayName(Meteor.users.findOne(userId));
}
getDisplayName = function(user){
	return (user.profile && user.profile.name) ? user.profile.name : user.username
}
getCurrentUserEmail = function(){
	return Meteor.user() ? Meteor.user().emails[0].address : '';
}
userProfileComplete = function(user) {
	if(user.services && user.services.twitter){
		return !!user.profile.email;
	}else{
		return true;
	}
}