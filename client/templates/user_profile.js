

Template.user_profile.user = function(){
	if(window.selected_user_id){
		return Meteor.users.findOne(window.selected_user_id);
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
	return Meteor.user() && (window.selected_user_id === Meteor.user()._id);
}