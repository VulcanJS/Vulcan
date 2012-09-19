isAdmin=function(userOrId){
	var user= typeof userOrId === 'string' ? Meteor.users.findOne(userOrId) : userOrId;
	console.log(user);
	return user.isAdmin;
}