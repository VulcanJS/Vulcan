sessionSetObject=function(name, value){
	Session.set(name, JSON.stringify(value));
}
sessionGetObject=function(name){
	return JSON.parse(Session.get(name));
}

Errors = new Meteor.Collection(null);

Meteor.subscribe('users');

Posts = new Meteor.Collection('posts');
// Meteor.subscribe('posts');

// Session.set('page_size', 8);
// Session.set('current_page', 1);
// Session.set('sort_order', JSON.stringify({score: -1}));
var postsView={
	find: {},
	sort: {submitted: -1},
	skip:0,
	postsPerPage:10,
	limit:10
}
sessionSetObject('postsView', postsView);

Meteor.autosubscribe(function() {
	var view=sessionGetObject('postsView');
	console.log(view);
	Meteor.subscribe('posts', view.find, view.sort, view.skip, view.limit, function() {
		console.log('found '+Posts.find().count()+' posts');
		// var newPostsCount = Posts.find().count();
		// if (Session.equals('posts_count', newPostsCount)) {
		// 	// We didn't fetch any new post, so hide the "View more" button:
		// 	$('button.more').hide();
		// }
		// else {
		// 	Session.set('posts_count', newPostsCount);
		// 	$('button.more').show();
		// }
	});
});

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