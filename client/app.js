Meteor.subscribe('users');

Posts = new Meteor.Collection('posts');
Meteor.subscribe('posts');

Comments = new Meteor.Collection('comments');

Meteor.subscribe('comments', function() {
   StyleNewRecords = new Date();
});


Settings = new Meteor.Collection('settings');
Meteor.subscribe('settings', function(){

	// runs once on site load

	if((proxinoKey=getSetting('proxinoKey'))){
		Proxino.key = proxinoKey;
		Proxino.track_errors();
	}
});

$.fn.exists = function () {
    return this.length !== 0;
}

getAuthorName = function(item){
	// if item is linked to a user, get that user's display name. Else, return the author field.
	return item.user_id && (user=Meteor.users.findOne(item.user_id)) ? getDisplayName(user) : this.author;
}

