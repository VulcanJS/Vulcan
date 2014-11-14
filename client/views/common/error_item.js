Template[getTemplate('error_item')].helpers({

});

Template[getTemplate('error_item')].created = function(){
	var error_id=this.data._id;
	Meteor.setTimeout(function(){
		Errors.update(error_id, {$set: {seen:true}});
	}, 100);
};