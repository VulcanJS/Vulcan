Template.user_item.rendered = function(){
	console.log(this.data);
};

Template.user_item.avatar_url = function(){
	return Gravatar.getGravatar(this, {
		d: 'http://telescope.herokuapp.com/img/default_avatar.png',
		s: 30
	});
};

Template.user_item.created_at_formatted = function(){
	var nice_date=moment(this.created_at);
	return nice_date.format("MMMM Do YYYY, HH:mm");
}