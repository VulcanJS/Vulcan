isAdminById=function(userId){
	var user = Meteor.users.findOne(userId);
	return user && isAdmin(user);
}
isAdmin=function(user){
	return user.isAdmin;
}
getDisplayNameById = function(userId){
	getDisplayName(Meteor.users.findOne(userId));
}
getDisplayName = function(user){
	return (user.profile && user.profile.name) ? user.profile.name : user.username
}
getSignupMethod = function(user){
	if(user.services && user.services.twitter){
		return 'twitter';
	}else{
		return 'regular'
	}
}
getEmail = function(user){
	if(getSignupMethod(user)=='twitter'){
		return user.profile.email;
	}else if(user.emails){
		return user.emails[0].address || user.emails[0].email;
	}else{ 
		return ''; 
	}
}
getAvatarUrl = function(user){
	if(getSignupMethod(user)=='twitter'){
		return 'https://api.twitter.com/1/users/profile_image?screen_name='+user.services.twitter.screenName;
	}else{
		return Gravatar.getGravatar(user, {
			d: 'http://telesc.pe/img/default_avatar.png',
			s: 30
		});
	}
}
getCurrentUserEmail = function(){
	return Meteor.user() ? getEmail(Meteor.user()) : '';
}
userProfileComplete = function(user) {
	return !!getEmail(user);
}

// Permissions

canView = function(user){

}
canPost = function(user){
	if(typeof user=='undefined')
		return false
	if(isAdmin(user))
		return true;
	if(getSetting('requireInvite')==true){
		return user.isInvited;
	}
	return true;
}
canComment = function(user){
	if(typeof user=='undefined')
		return false;
	if(isAdmin(user))
		return true;
	if(getSetting('requireInvite')==true){
		return user.isInvited;
	}
	return true;
}