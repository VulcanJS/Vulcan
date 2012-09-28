Meteor.accounts.onCreateUser(function(options, extra, user){
	// user.created_at=new Date().getTime();
	user.email_hash  = CryptoJS.MD5(options.email.trim().toLowerCase()).toString();
	user.karma       = 0;
	return user;
});