var settingsForm;

function form() {	
	settingsForm = new ModelForm(Settings, settingsFormOptions());
	return settingsForm;
}

Template.settings.helpers({
	generateSettingsForm: function (setting) {
		Meteor.defer(function() {
			form().generateFor(setting);
		})	
	},
	noSettings: function(){
		if (Settings.findOne()) {
			return false;
		}
		return true;
	},
	setting: function(){
		var setting = Settings.find().fetch()[0];
		return new Setting(setting) || new Setting();
	}
});

Template.settings.events = {
	'click input[type=submit]': function(e){
		e.preventDefault();
		if(!Meteor.user()) throw 'You must be logged in.';

		settingsForm.submit(
		function(){
		   	throwError("Settings have been created");
		},
		function(error) {
			if(error) console.log(error);
		      	throwError("Settings have been updated");
		});
	}
};

function settingsFormOptions() {
	return {
		'requireViewInvite': {
			title: 'Require Invite to view?'
		},
		'requirePostInvite': {
			title: 'Require Invite to post?'
		},
		'requirePostsApproval': {
			title: 'Posts must be approved by admin?'
		},
		'title': {
			title: 'Site Title'
		},
		'theme': {
			'enum': [
				'Default',
				'Ascndr',
				'Telescope'
			]
		},
		'footerCode': {
			type: 'textarea'
		},
		'analyticsCode': {
			type: 'textarea'
		},
		'tlkioChannel': {
			title: '<a href="http://tlk.io/">Tlk.io</a> Channel'
		},
		'mixpanelId': {
			title: '<a href="http://mixpanel.com/">Mixpanel</a> ID'
		},
		'proxinoKey': {
			title: '<a href="http://proxino.com/">Proxino</a> key'
		},
		'goSquaredId': {
			title: '<a href="http://gosquared.com/">GoSquared</a> ID'
		},
		'intercomId': {
			title: '<a href="http://intercom.io/">Intercom</a> ID'
		},
		'veroAPIKey': {
			title: '<a href="http://getvero.com/">Vero</a> API key'
		},
		'veroSecret': {
			title: '<a href="http://getvero.com/">Vero</a> secret'
		},
		'logoUrl': {
			title: 'Logo URL'
		},
		'landingPageText': {
			type: 'textarea'
		},
		'afterSignupText': {
			type: 'textarea'
		},
		'notes': {
			type: 'textarea'
		}
	};
}