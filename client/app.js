Errors = new Meteor.Collection(null);

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

	window.settingsLoaded=true;

	if((proxinoKey=getSetting('proxinoKey'))){
		Proxino.key = proxinoKey;
		Proxino.track_errors();
	}

	// window.Router = new SimpleRouter();
	window.Backbone.history.start({pushState: true});

});

$.fn.exists = function () {
    return this.length !== 0;
}

$(document).bind('keyup', 'ctrl+n', function(){
	$('.notifications').toggleClass('hidden');
});

Handlebars.registerHelper('canView', function(action) {
	var action=(typeof action !== 'string') ? null : action;
	return canView(Meteor.user(), action);
});
Handlebars.registerHelper('canPost', function(action) {
	var action=(typeof action !== 'string') ? null : action;
	return canPost(Meteor.user(), action);
});
Handlebars.registerHelper('canComment', function(action) {
	var action=(typeof action !== 'string') ? null : action;
	return canComment(Meteor.user(), action);
});
Handlebars.registerHelper('canUpvote', function(collection, action) {
	var action=(typeof action !== 'string') ? null : action;
	return canUpvote(Meteor.user()), collection, action;
});
Handlebars.registerHelper('canDownvote', function(collection, action) {
	var action=(typeof action !== 'string') ? null : action;
	return canDownvote(Meteor.user(), collection, action);
});