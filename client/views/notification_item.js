Template.notification_item.helpers({
	nice_time: function(){
		return moment(this.timestamp).fromNow();
	},
	properties: function(){
		return this.properties;
	},
	isNewComment: function(){
		return this.event=="newComment";
	},
	isNewReply: function(){
		return this.event=="newReply";
	},
	postHeadline: function(){
		var post=Posts.findOne(this.postId);
		if(post)
			return post.headline;
	}
});