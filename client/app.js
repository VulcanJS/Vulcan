Meteor.subscribe('users');

Posts = new Meteor.Collection('posts');
Meteor.subscribe('posts');

Comments = new Meteor.Collection('comments');
Meteor.subscribe('comments', function() {
   StyleNewRecords = new Date();
});

Notifications = new Meteor.Collection('notifications');
Meteor.subscribe('notifications');

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

$(document).bind('keyup', 'ctrl+n', function(){
	$('.notifications').toggleClass('hidden');
});

Handlebars.registerHelper('canView', function(redirect) {
	var redirect=(redirect=="true");
	return canView(Meteor.user(), redirect);
});
Handlebars.registerHelper('canPost', function(redirect) {
	var redirect=(redirect=="true");
	return canPost(Meteor.user(), redirect);
});
Handlebars.registerHelper('canComment', function(redirect) {
	var redirect=(redirect=="true");
	return canComment(Meteor.user(), redirect);
});
Handlebars.registerHelper('canUpvote', function(collection, redirect) {
	var redirect=(redirect=="true");
	return canUpvote(Meteor.user()), collection, redirect;
});
Handlebars.registerHelper('canDownvote', function(collection, redirect) {
	var redirect=(redirect=="true");
	return canDownvote(Meteor.user(), collection, redirect);
});