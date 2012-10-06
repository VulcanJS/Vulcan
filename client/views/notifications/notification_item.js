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
	isMessage: function(){
		return this.event=="message";
	},
	postHeadline: function(){
		var post=Posts.findOne(this.postId);
		if(post)
			return post.headline;
	}
});

Template.notification_item.events({
  'click .action-link': function(event, instance){
    Meteor.call('markNotificationAsRead', instance.data._id);
  }
});