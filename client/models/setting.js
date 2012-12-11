
var Setting = FormModel.extend({
		
	blankSchema: {
		requireViewInvite: false,
	    requirePostInvite: false,
	    requirePostsApproval: false,
	    title: '',
	    theme: '',
	    footerCode: '',
	    analyticsCode: '',
	    tlkioChannel: '',
	    mixpanelId: '',
	    clickyId:'',
	    proxinoKey: '',
	    goSquaredId: '',
		veroAPIKey: '',
		veroSecret: '',
		intercomId: '',
		logoUrl: '',
		logoHeight: '',
		logoWidth: '',
		scoreUpdateInterval: '',
		landingPageText: '',
		afterSignupText: '',
		notes: '',
	},		

	init: function(options) {
		this._super(Settings, options);
		
		this.overwriteTitle('requireViewInvite', 'Require Invite to view?');
		this.overwriteTitle('requirePostInvite', 'Require Invite to post?');
		this.overwriteTitle('requirePostsApproval', 'Posts must be approved by admin?');
		this.overwriteTitle('title', 'Site Title');
		this.overwriteTitle('tlkioChannel', '<a href="http://tlk.io/">Tlk.io</a> Channel');
		this.overwriteTitle('mixpanelId', '<a href="http://mixpanel.com/">Mixpanel</a> ID');
		this.overwriteTitle('clickyId', '<a href="http://getclicky.com/">Clicky</a> ID');
		this.overwriteTitle('proxinoKey', '<a href="http://proxino.com/">Proxino</a> key');
		this.overwriteTitle('goSquaredId', '<a href="http://gosquared.com/">GoSquared</a> ID');
		this.overwriteTitle('intercomId', '<a href="http://intercom.io/">Intercom</a> ID');
		this.overwriteTitle('veroAPIKey', '<a href="http://getvero.com/">Vero</a> API key');
		this.overwriteTitle('veroSecret', '<a href="http://getvero.com/">Vero</a> secret');
		this.overwriteTitle('logoUrl', 'Logo URL');
		this.overwriteType('footerCode', 'textarea');
		this.overwriteType('analyticsCode', 'textarea');
		this.overwriteType('landingPageText', 'textarea');
		this.overwriteType('afterSignupText', 'textarea');
		this.overwriteType('notes', 'textarea');
		this.makeSelect('theme', ['Default', 'Ascndr', 'Telescope'])			
	}
});
