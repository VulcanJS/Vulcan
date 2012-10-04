Template.notification_item.helpers({
	nice_time: function(){
		return moment(this.timestamp).fromNow();
	},
	properties: function(){
		return this.properties;
	},
	isNewRootComment: function(){
		return this.event=="newRootComment";
	},
	isNewChildComment: function(){
		return this.event=="newChildComment";
	}
});