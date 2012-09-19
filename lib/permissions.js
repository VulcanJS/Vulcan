isAdmin=function(userOrId){
	var user= typeof userOrId === 'string' ? Meteor.users.findOne(userOrId) : userOrId;
	var email=user.emails[0].email;
	var adminEmails=["sacha357@gmail.com", "your_email_here@gmail.com"];
	return adminEmails.indexOf(email) != -1
}