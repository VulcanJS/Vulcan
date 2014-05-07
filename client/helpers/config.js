Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

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
