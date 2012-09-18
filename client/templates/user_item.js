Template.user_item.rendered = function(){
};

Template.user_item.avatar_url = function(){
	return Gravatar.getGravatar(this, {
		d: 'http://telescope.herokuapp.com/img/default_avatar.png',
		s: 30
	});
};

Template.user_item.created_at_formatted = function(){
	// return moment(this.created_at).format("MMMM Do YYYY, HH:mm");
	return moment(this.created_at).fromNow();
}

Template.user_item.email = function(){
	if(this.emails){
		return this.emails[0].email;
	}
}

Template.user_item.posts = function(){
	return Posts.find({'user_id':this._id});
}

Template.user_item.posts_count = function(){
	return Posts.find({'user_id':this._id}).count();
}

Template.user_item.comments = function(){
	return Comments.find({'user_id':this._id});
}

Template.user_item.comments_count = function(){
	// Posts.find({'user_id':this._id}).forEach(function(post){console.log(post.headline);});
	return Comments.find({'user_id':this._id}).count();
}