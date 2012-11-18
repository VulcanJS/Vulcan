var Setting = function (options) {
	this._id = null;
	this.requireViewInvite = false;
    this.requirePostInvite = false;
    this.requirePostsApproval = false;
    this.title = '';
    this.theme = '';
    this.footerCode = '';
    this.analyticsCode = '';
    this.mixpanelId = '';
    this.proxinoKey = '';
    this.goSquaredId = '';
	this.veroAPIKey = '';
	this.veroSecret = '';
	this.intercomId = '';
	this.logoUrl = '';
	this.logoHeight = '';
	this.logoWidth = '';
	this.scoreUpdateInterval = '';
	this.landingPageText = '';
	this.afterSignupText = '';
	this.notes = '';
	
	for (field in this) {
		if (options && options[field]) this[field] = options[field];
	}
}
