

Template.user_profile.user = function(){
	if(window.selectedUserId){
		return Meteor.users.findOne(window.selectedUserId);
	}
}

Template.user_profile.avatar_url = function(){
	return Gravatar.getGravatar(this, {
		d: 'http://telescope.herokuapp.com/img/default_avatar.png',
		s: 80
	});
}

Template.user_profile.created_at_formatted = Template.user_item.created_at_formatted;

Template.user_profile.is_current_user = function(){
	return Meteor.user() && (window.selectedUserId === Meteor.user()._id);
}