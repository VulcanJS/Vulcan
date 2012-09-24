var current_user_id=0;
if(Meteor.user()){
	current_user_id=Meteor.user()._id;
}

Meteor.subscribe('users', current_user_id, function(){
	// once we've subscribed, set a session variable to check if the current user is an admin
	Session.set('currentUserIsAdmin', (Meteor.user() && !Meteor.user().loading) ? isAdmin(Meteor.user()) : false );	
});

Posts = new Meteor.Collection('posts');
Meteor.subscribe('posts');

Comments = new Meteor.Collection('comments');

Meteor.subscribe('comments', function() {
   StyleNewRecords = new Date();
});


Settings = new Meteor.Collection('settings');
Meteor.subscribe('settings', function(){
	if(proxinoKey=getSetting('proxinoKey')){
		Proxino = {
		  key:null,
		  log:function(obj){
		    if(typeof(obj) === "string"){
		      obj = {type:"Message", body:obj}
		    }
		    if(obj.type === undefined || obj.body === undefined){
		      throw "Make sure object meets form:{type:_,body:_}"
		    }
		    if(Proxino.key === null){
		      throw "Please set your API key."
		    }
		    obj.key = Proxino.key;
		    if(obj.url === undefined){
		      var g_url;
		      try{
		        g_url = Proxino.get_url(obj.body);
		      }
		      catch(e){
		        g_url = null;
		      }
		      if(g_url !== null && g_url.length > 0){
		          obj.url = g_url[0];
		      }
		      else{
		        obj.url = document.URL;
		      }
		    }
		    try{
		      $.ajax({
		        url:"https://p.proxino.com/message",
		        data:obj,
		        dataType:"jsonp",
		        success:function(data){
		          //console.log(data);
		        }
		      }); 
		    }
		    catch(exc){
		      // Ignore failure to post, don't want recursive loop
		    }
		  },
		  track_errors:function(){
		    if(Proxino.key === null){
		      throw "Please set your API key."
		    }
		    window.onerror = function(msg, url, lineno){
		      var data = {type:"Exception",body:msg}; 
		      if(msg === undefined){
		        data.body = "No message";
		      }
		      if(url !== undefined && url !== "undefined" && url !== ""){
		        data.url = url;
		      }
		      if(lineno !== undefined && lineno !== 0){
		        data.lineno = lineno;
		      }
		      //var body_str = msg + " at resource " + url + " in line " + lineno;
		      Proxino.log(data);
		    }
		  },
		  get_url:function(text) {
		      var urlRegex = /(https?:\/\/[^\s]+)/g;
		      return text.match(urlRegex);
		  }
		}
		Proxino.key = proxinoKey;
		Proxino.track_errors();
	}	
});

Session.set('state', 'list');

if (Meteor.is_client) {
	SimpleRouter = FilteredRouter.extend({
		initialize: function() {
			FilteredRouter.prototype.initialize.call(this);
			this.filter(this.require_login, {only: ['submit']});
			this.filter(this.start_request);
		},
		start_request: function(page){
			Session.set("error", null);
			if(Meteor.user() && !Meteor.user().createdAt){
				throwError("Due to the Auth API update, please log out and then create a new account. Sorry!")
			}
			return page;
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
		  'account':'user_edit',
		  'forgot_password':'forgot_password',
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
		},
		user_edit: function(id){
			if(typeof id !== undefined){
				window.selected_user_id=id;
			}
			this.goto('user_edit');
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

currentUserIsAdmin = function(){
	return Session.get('currentUserIsAdmin');
}

getSetting = function(setting){
	var settings=Settings.find().fetch()[0];
	if(settings){
		return settings[setting];
	}
	return '';
}

getCurrentUserEmail = function(){
	return Meteor.user() ? Meteor.user().emails[0].email : '';
}

trackEvent = function(event, properties){
	var properties= (typeof properties === 'undefined') ? {} : properties;
	if(mixpanel){
		mixpanel.track(event, properties);
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
SharrreOptions={
	share: {
	  googlePlus: true,
	  // facebook: true,
	  twitter: true,
	},
	buttons: {
	  googlePlus: {size: 'tall'},
	  // facebook: {layout: 'box_count'},
	  twitter: {
	    count: 'vertical',
	    via: 'TelescopeApp'
	  },
	},
	enableHover: false,
	enableCounter: false,
	enableTracking: true
}
Meteor.startup(function(){
	
});