settingsSchemaObject = {
  title: {
    type: String,
    label: "Title",
    optional: true
  },
  siteUrl: {
    type: String,
    optional: true,
    label: 'Site URL (with trailing "/")'
  },
  tagline: {
    type: String,
    label: "Tagline",
    optional: true
  },
  requireViewInvite: {
    type: Boolean,
    label: "Require invite to view",
    optional: true
  },
  requirePostInvite: {
    type: Boolean,
    label: "Require invite to post",
    optional: true
  },
  requirePostsApproval: {
    type: Boolean,
    label: "Posts must be approved by admin",
    optional: true
  },
  emailNotifications: {
    type: Boolean,
    label: "Enable email notifications",
    optional: true
  },
  nestedComments: {
    type: Boolean,
    label: "Enable nested comments",
    optional: true
  },
  redistributeKarma: {
    type: Boolean,
    label: "Enable redistributed karma",
    optional: true
  },
  defaultEmail: {
    type: String,
    optional: true
  },       
  scoreUpdateInterval: {
    type: Number,
    optional: true
  }, 
  postInterval: {
    type: Number,
    optional: true
  },
  commentInterval: {
    type: Number,
    optional: true
  },
  maxPostsPerDay: {
    type: Number,
    optional: true
  },
  startInvitesCount: {
    type: Number,
    defaultValue: 3,
    optional: true
  },
  postsPerPage: {
    type: Number,
    defaultValue: 10,
    optional: true
  },
  logoUrl: {
    type: String,
    optional: true
  },
  logoHeight: {
      type: Number,
      optional: true
  },
  logoWidth: {
      type: Number,
      optional: true
  },
  language: {
      type: String,
      defaultValue: 'en',
      optional: true
  },
  backgroundCSS: {
    type: String,
    optional: true,
    label: "Background CSS: color, image, etc."
  },
  // secondaryColor: {
  //   type: String,
  //   optional: true
  // },
  buttonColor: {
    type: String,
    optional: true
  },
  buttonTextColor: {
    type: String,
    optional: true
  },  
  headerColor: {
    type: String,
    optional: true
  },
  headerTextColor: {
    type: String,
    optional: true
  },  
  twitterAccount: {
    type: String,
    optional: true
  },
  googleAnalyticsId: {
    type: String,
    optional: true
  },
  mixpanelId: {
    type: String,
    optional: true
  },
  clickyId: {
    type: String,
    optional: true
  },
  footerCode: {
    type: String,
    optional: true
  },
  extraCode: {
    type: String,
    optional: true
  },
  emailFooter: {
    type: String,
    optional: true
  },
  notes: {
    type: String,
    optional: true
  }                                                                                                                                                                            
};

// add any extra properties to settingsSchemaObject (provided by packages for example)
_.each(addToSettingsSchema, function(item){
  settingsSchemaObject[item.propertyName] = item.propertySchema;
});

Settings = new Meteor.Collection("settings", {
  schema: new SimpleSchema(settingsSchemaObject)
});

Settings.allow({
  insert: isAdminById,
  update: isAdminById,
  remove: isAdminById
});

