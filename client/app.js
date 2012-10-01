Meteor.subscribe('users');

Posts = new Meteor.Collection('posts');
Meteor.subscribe('posts');

Comments = new Meteor.Collection('comments');

Meteor.subscribe('comments', function() {
   StyleNewRecords = new Date();
});


Settings = new Meteor.Collection('settings');
Meteor.subscribe('settings', function(){
	if((proxinoKey=getSetting('proxinoKey'))){
		Proxino.key = proxinoKey;
		Proxino.track_errors();
	}
});

Session.set('state', 'list');

$.fn.exists = function () {
    return this.length !== 0;
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