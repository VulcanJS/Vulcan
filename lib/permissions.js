isAdmin=function(userOrId){
	var user= typeof userOrId === 'string' ? Meteor.users.findOne(userOrId) : userOrId;
	return user.isAdmin;
}