Meteor.subscribe('users');

Posts = new Meteor.Collection('posts');
Meteor.subscribe('posts');

Comments = new Meteor.Collection('comments');

Meteor.subscribe('comments', function() {
   StyleNewRecords = new Date();
});

MyVotes = new Meteor.Collection('myvotes');
Meteor.subscribe('myvotes');

Settings = new Meteor.Collection('settings');
Meteor.subscribe('settings');

Session.set('state', 'list');

if (Meteor.is_client) {
	SimpleRouter = FilteredRouter.extend({
		initialize: function() {
			FilteredRouter.prototype.initialize.call(this);
			this.filter(this.require_login, {only: ['submit']});
		},
		require_login: function(page) {
			console.log(Meteor.user());
		  if (Meteor.user()) {
		    return page;
		  } else {
		    return 'signin';
		  }
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
		  'posts/:id':'post',
		  'posts/:id/edit':'post_edit',
		  'comments/deleted':'comment_deleted',		  
		  'comments/:id':'comment',
		  'comments/:id/edit':'comment_edit',
		  'settings':'settings',
		  'users':'users',
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
		post: function(id) {
			console.log("post, id="+id); 
			Session.set('selected_post_id', id); 
			this.goto('post_page');
			// on post page, we show the comment recursion
			window.repress_recursion=false;
			// reset the new comment time at each new request of the post page
			window.newCommentTimestamp=new Date();
		},
		post_edit: function(id) {
			console.log("post_edit, id="+id); 
			Session.set('selected_post_id', id); 
			this.goto('post_edit'); 
		},
		comment: function(id) {
			console.log("comment, id="+id); 
			Session.set('selected_comment_id', id);
			this.goto('comment_page');
			window.repress_recursion=true;
			window.newCommentTimestamp=new Date();
		},
		comment_edit: function(id) {
			console.log("comment_edit, id="+id); 
			Session.set('selected_comment_id', id);
			this.goto('comment_edit');
			window.newCommentTimestamp=new Date();
		}	
	});
  
	var Router = new SimpleRouter();
	Meteor.startup(function() {
		Backbone.history.start({pushState: true});
	});
}

t=function(message){
	var d=new Date();
	console.log("### "+message+" rendered at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
}

function nl2br (str) {   
var breakTag = '<br />';    
return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

$.fn.exists = function () {
    return this.length !== 0;
}

getGravatar = function(email, defaultImage){
	defaultURL = (typeof defaultImage === "undefined") ? "" : "?d="+defaultImage;
	if(CryptoJS){
		hash = CryptoJS.MD5(email.trim().toLowerCase());
		return "http://www.gravatar.com/avatar/"+hash+defaultURL;
	}
}


EpicEditorOptions={
	container:  'editor',
	basePath:   '/editor',
	clientSideStorage: false,
	theme: {
		base:'/themes/base/epiceditor.css',
		preview:'/themes/preview/github.css',
		editor:'/themes/editor/epic-light.css'
	}
};