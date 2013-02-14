
var Setting = FormModel.extend({
      
  blankSchema: {
    requireViewInvite: false,
    requirePostInvite: false,
    requirePostsApproval: false,
    scoreUpdateInterval: '',
    postInterval: '',
    commentInterval: '',
    maxPostsPerDay: '',
    title: '',
    logoUrl: '',
    logoHeight: '',
    logoWidth: '',
    defaultEmail: '',
    newPostsNotifications: true,
    backgroundColor: '',
    secondaryColor: '',
    buttonColor: '',
    headerColor: '',
    mixpanelId: '',
    clickyId:'',
    goSquaredId: '',
    footerCode: '',
    extraCode: '', 
    notes: ''
  },      

  init: function(options) {
    this._super(Settings, options);
    this.overwriteTitle('scoreUpdateInterval', 'Scoring Frequency'); 
    this.overwriteTitle('requireViewInvite', 'Require Invite to view?');
    this.overwriteTitle('requirePostInvite', 'Require Invite to post?');
    this.overwriteTitle('requirePostsApproval', 'Posts must be approved by admin?');
    this.overwriteTitle('title', 'Site Title');
    this.overwriteTitle('mixpanelId', '<a href="http://mixpanel.com/">Mixpanel</a> ID');
    this.overwriteTitle('clickyId', '<a href="http://getclicky.com/">Clicky</a> ID');
    this.overwriteTitle('goSquaredId', '<a href="http://gosquared.com/">GoSquared</a> ID');
    this.overwriteTitle('logoUrl', 'Logo URL');
    this.overwriteType('footerCode', 'textarea');
    this.overwriteType('extraCode', 'textarea');
    this.overwriteType('notes', 'textarea');
  }
});
