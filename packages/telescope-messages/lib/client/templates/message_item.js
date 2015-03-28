Template[getTemplate('message_item')].onCreated(function(){
	var messageId=this.data._id;

	Meteor.setTimeout(function(){
		Messages.collection.update(messageId, {$set: {seen:true}});
	}, 100);
});
