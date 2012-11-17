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