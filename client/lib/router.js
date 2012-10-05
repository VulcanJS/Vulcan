SimpleRouter = FilteredRouter.extend({
	initialize: function() {
		FilteredRouter.prototype.initialize.call(this);
		this.filter(this.require_login, {only: ['submit']});
		this.filter(this.start_request);
		this.filter(this.require_profile);
	},
	start_request: function(page){
		// runs at every new page change

		Session.set("error", null);
		Session.set("openedComments", null);
		document.title = getSetting("title");

		// Mixpanel

		if((mixpanelId=getSetting("mixpanelId")) && window.mixpanel.length==0){
			mixpanel.init(mixpanelId);
			if(Meteor.user()){
				var currentUserEmail=getCurrentUserEmail();
				mixpanel.people.identify(currentUserEmail);
				mixpanel.people.set({
				    'username': getDisplayName(Meteor.user()),
				    '$last_login': new Date(), 
				    '$created': moment(Meteor.user().createdAt)._d,
				    '$email': currentUserEmail
				});
				mixpanel.register({
				    'username': getDisplayName(Meteor.user()),
				    'createdAt': moment(Meteor.user().createdAt)._d,
				    'email': currentUserEmail
				});
				mixpanel.name_tag(currentUserEmail);
			}
		}

		// GoSquared

	    if((goSquaredId=getSetting("goSquaredId"))){
			GoSquared.acct = goSquaredId;
			GoSquaredInit();
		}

		// Intercom
		if((intercomId=getSetting("intercomId")) && Meteor.user()){
			window.intercomSettings = {
				app_id: intercomId,
				email: currentUserEmail,
				created_at: Meteor.user().createdAt
			};
			IntercomInit();
		}

		return page;
	},
	require_login: function(page) {
	  if (Meteor.user()) {
	    return page;
	  } else {
	    return 'signin';
	  }
	},
  
	// if the user is logged in but their profile isn't filled out enough
	require_profile: function(page) {
	var user = Meteor.user();
	if  (user && !user.loading && !userProfileComplete(user))
	  return 'user_email';
	else
	  return page;
	},
  
	routes: {
		'': 'top',
		'top':'top',
		'new':'new',
		'test':'test',
		'signin':'signin',
		'signup':'signup',
		'submit':'submit',
		'posts/deleted':'post_deleted',
		'posts/:id/edit':'post_edit',
		'posts/:id/comment/:comment_id':'post',
		'posts/:id':'post',
		'comments/deleted':'comment_deleted',	  
		'comments/:id':'comment',
		'comments/:id/edit':'comment_edit',
		'settings':'settings',
		'admin':'admin',
		'users':'users',
		'account':'user_edit',
		'forgot_password':'forgot_password',
		'users/:id': 'user_profile',
		'users/:id/edit':'user_edit'
	},
	top: function() { this.goto('posts_top'); },
	new: function() { this.goto('posts_new'); },		
	signup: function() { this.goto('signup'); },
	signin: function() { this.goto('signin'); },
	submit: function() { this.goto('post_submit'); },
	settings: function() { this.goto('settings'); },
	users: function() { this.goto('users'); },
	post_deleted: function() { this.goto('post_deleted'); },
	comment_deleted: function() { this.goto('comment_deleted'); },
	forgot_password: function() { this.goto('user_password'); },
	admin: function() {this.goto('admin'); },
	post: function(id, commentId) {
		console.log("post, id="+id+', commentId='+commentId); 
		window.template='post_page'; 
		Session.set('selectedPostId', id);
		if(typeof commentId !== 'undefined')
			Session.set('scrollToCommentId', commentId); 
		this.goto('post_page');
		// on post page, we show the comment recursion
		window.repress_recursion=false;
		// reset the new comment time at each new request of the post page
		window.newCommentTimestamp=new Date();
	},
	post_edit: function(id) {
		console.log("post_edit, id="+id);
		window.template='post_edit';
		Session.set('selectedPostId', id); 
		this.goto('post_edit'); 
	},
	comment: function(id) {
		console.log("comment, id="+id);
		window.template='comment_page';
		Session.set('selectedCommentId', id);
		this.goto('comment_page');
		window.repress_recursion=true;
		window.newCommentTimestamp=new Date();
	},
	comment_edit: function(id) {
		console.log("comment_edit, id="+id);
		window.template='comment_edit'; 
		Session.set('selectedCommentId', id);
		this.goto('comment_edit');
		window.newCommentTimestamp=new Date();
	},
	user_profile: function(id){
		if(typeof id !== undefined){
			window.selectedUserId=id;
		}
		this.goto('user_profile');
	},
	user_edit: function(id){
		if(typeof id !== undefined){
			window.selectedUserId=id;
		}
		this.goto('user_edit');
	}
});
  
var Router = new SimpleRouter();
Meteor.startup(function() {
	Backbone.history.start({pushState: true});
});