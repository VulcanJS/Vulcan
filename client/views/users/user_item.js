Template.user_item.rendered = function(){
};

Template.user_item.helpers({
	avatarUrl: function(){
		return getAvatarUrl(this);
	},
	createdAtFormatted: function(){
		return this.createdAt ? moment(this.createdAt).fromNow() : '–';
	},
	displayName: function(){
		return getDisplayName(this);
	},
	email: function(){
		return getEmail(this);
	},
	posts: function(){
		return Posts.find({'userId':this._id});
	},
	postsCount: function(){
		return Posts.find({'userId':this._id}).count();
	},
	comments: function(){
		return Comments.find({'userId':this._id});
	},
	commentsCount: function(){
		// Posts.find({'user_id':this._id}).forEach(function(post){console.log(post.headline);});
		return Comments.find({'userId':this._id}).count();
	},
	userIsAdmin: function(){
		return isAdmin(this);
	}
});

Template.user_item.events({
	'click .invite-link': function(e, instance){
		e.preventDefault();
		var user = Meteor.users.findOne(instance.data._id);
		Meteor.users.update(user._id,{
			$set:{
				isInvited: true
			}
		}, {multi: false}, function(error){
			if(error){
				throwError();
			}else{
				Meteor.call('createNotification','accountApproved', {}, user);
			}
		});
	},
	'click .uninvite-link': function(e, instance){
		e.preventDefault();
		Meteor.users.update(instance.data._id,{
			$set:{
				isInvited: false
			}
		});
	},
	'click .admin-link': function(e, instance){
		e.preventDefault();
		Meteor.users.update(instance.data._id,{
			$set:{
				isAdmin: true
			}
		});
	},
	'click .unadmin-link': function(e, instance){
		e.preventDefault();
		Meteor.users.update(instance.data._id,{
			$set:{
				isAdmin: false
			}
		});
	},
	'click .delete-link': function(e, instance){
		e.preventDefault();
		if(confirm("Are you sure you want to delete "+getDisplayName(instance.data)+"?"))
			Meteor.users.remove(instance.data._id);
	}
})