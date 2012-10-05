isAdminById=function(userId){
	var user = Meteor.users.findOne(userId);
	return user && isAdmin(user);
}
isAdmin=function(user){
	if(!user)
		return false;
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

// user: 		Defaults to Meteor.user()
// redirect: 	Defaults to false. If false, the permission check will fail silently
// 				If true, a failed permission check will throw an error message and redirect the user
canView = function(user, redirect){
	var user=(typeof user === 'undefined') ? Meteor.user() : user;
	var redirect=(typeof redirect === 'undefined') ? false : redirect;
	if(getSetting('requireViewInvite')==true){
		try{
			if(!user){
				throw "no_account";
			}else if(isAdmin(user) || user.isInvited){
				return true;
			}else{
				throw "no_invite";
			}
		}catch(error){
			if(redirect)
				Router.goto(error);
			return false;
		}
	}else{
		return true;
	}
}
canPost = function(user, redirect){
	var user=(typeof user === 'undefined') ? Meteor.user() : user;
	var redirect=(typeof redirect === 'undefined') ? false : redirect;
	try{
		if(!user){
			throw "no_account";
		}else if(isAdmin(user)){
			return true;
		}else if(getSetting('requirePostInvite')){
			if(user.isInvited){
				return true;
			}else{
				throw "no_invite";
			}
		}else{
			return true;
		}
	}catch(error){
		if(redirect){
			switch(error){
				case "no_account":
					throwError("Please sign in or create an account first.");
            		Router.goto('signin');
					break;
				case "no_invite":
					throwError("Sorry, you need to have an invitation to do this.");
					Router.goto("no_invite");
					break;		
			}
		}	
		return false;
	}
}
canComment = function(user, redirect){
	var user=(typeof user === 'undefined') ? Meteor.user() : user;
	var redirect=(typeof redirect === 'undefined') ? false : redirect;
	return canPost(user, redirect);
}
canUpvote = function(user, collection, redirect){
	var user=(typeof user === 'undefined') ? Meteor.user() : user;
	var redirect=(typeof redirect === 'undefined') ? false : redirect;
	return canPost(user, redirect);
}
canDownvote = function(user, collection, redirect){
	var user=(typeof user === 'undefined') ? Meteor.user() : user;
	var redirect=(typeof redirect === 'undefined') ? false : redirect;
	return canPost(user, redirect);
}