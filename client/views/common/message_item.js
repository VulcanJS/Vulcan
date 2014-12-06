Template[getTemplate('message_item')].helpers({

});

Template[getTemplate('message_item')].created = function(){
	var messageId=this.data._id;
	Meteor.setTimeout(function(){
		Messages.update(messageId, {$set: {seen:true}});
	}, 100);
};