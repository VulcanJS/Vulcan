Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

SharrreOptions={
	share: {
	  googlePlus: true,
	  // facebook: true,
	  twitter: true
	},
	buttons: {
	  googlePlus: {size: 'tall', annotation:'bubble'},
	  // facebook: {layout: 'box_count'},
	  twitter: {
	    count: 'vertical',
	    via: 'TelescopeApp'
	  }
	},
	enableHover: false,
	enableCounter: false,
	enableTracking: true
};

Statuses={
	pending: 1,
	approved: 2,
	rejected: 3
};
