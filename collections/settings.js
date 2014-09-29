settingsSchemaObject = {
  title: {
    type: String,
    label: "Title",
    optional: true,
    autoform: {
      group: 'general'
    }
  },
  siteUrl: {
    type: String,
    optional: true,
    label: 'Site URL',
    autoform: {
      group: 'general',
      instructions: 'Your site\'s URL (with trailing "/"). Will default to Meteor.absoluteUrl()'
    }
  },
  tagline: {
    type: String,
    label: "Tagline",
    optional: true,
    autoform: {
      group: 'general'
    }
  },
  requireViewInvite: {
    type: Boolean,
    label: "Require invite to view",
    optional: true,
    autoform: {
      group: 'invites'
    }
  },
  requirePostInvite: {
    type: Boolean,
    label: "Require invite to post",
    optional: true,
    autoform: {
      group: 'invites'
    }
  },
  requirePostsApproval: {
    type: Boolean,
    optional: true,
    autoform: {
      group: 'general',
      instructions: "Posts must be approved by admin"
    }
  },
  // nestedComments: {
  //   type: Boolean,
  //   label: "Enable nested comments",
  //   optional: true,
  //   autoform: {
  //     group: 'comments'
  //   }
  // },
  // redistributeKarma: {
  //   type: Boolean,
  //   label: "Enable redistributed karma",
  //   optional: true,
  //   autoform: {
  //     group: 'general'
  //   }
  // },
  defaultEmail: {
    type: String,
    optional: true,
    autoform: {
      group: 'email',
      instructions: 'The address all outgoing emails will be sent from.'
    }
  },
  scoreUpdateInterval: {
    type: Number,
    optional: true,
    defaultValue: 30,
    autoform: {
      group: 'scoring',
      instructions: 'How often to recalculate scores, in seconds (default to 30)'
    }
  },
  defaultView: {
    type: String,
    optional: true,
    autoform: {
      group: 'posts',
      instructions: 'The view used for the front page',
      options: _.map(viewNav, function (view) {
        return {
          value: camelCaseify(view.label),
          label: view.label
        };
      })
    }
  },
  postInterval: {
    type: Number,
    optional: true,
    defaultValue: 30,
    autoform: {
      group: 'posts',
      instructions: 'Minimum time between posts, in seconds (defaults to 30)'
    }
  },
  commentInterval: {
    type: Number,
    optional: true,
    defaultValue: 15,
    autoform: {
      group: 'comments',
      instructions: 'Minimum time between comments, in seconds (defaults to 15)'
    }
  },
  maxPostsPerDay: {
    type: Number,
    optional: true,
    defaultValue: 30,
    autoform: {
      group: 'posts',
      instructions: 'Maximum number of posts a user can post in a day (default to 30).'
    }
  },
  startInvitesCount: {
    type: Number,
    defaultValue: 3,
    optional: true,
    autoform: {
      group: 'invites'
    }
  },
  postsPerPage: {
    type: Number,
    defaultValue: 10,
    optional: true,
    autoform: {
      group: 'posts'
    }
  },
  logoUrl: {
    type: String,
    optional: true,
    autoform: {
      group: 'logo'
    }
  },
  logoHeight: {
    type: Number,
    optional: true,
    autoform: {
      group: 'logo'
    }
  },
  logoWidth: {
    type: Number,
    optional: true,
    autoform: {
      group: 'logo'
    }
  },
  language: {
    type: String,
    defaultValue: 'en',
    optional: true,
    autoform: {
      group: 'general',
      instructions: 'The two-letter code for the app\'s language. Defaults to "en".'
    }
  },
  backgroundCSS: {
    type: String,
    optional: true,
    label: "Background CSS",
    autoform: {
      group: 'extras',
      instructions: 'CSS code for the <body>\'s "background" property',
      rows: 5
    }
  },
  // secondaryColor: {
  //   type: String,
  //   optional: true
  // },
  buttonColor: {
    type: String,
    optional: true,
    autoform: {
      group: 'colors'
    }
  },
  buttonTextColor: {
    type: String,
    optional: true,
    autoform: {
      group: 'colors'
    }
  },
  headerColor: {
    type: String,
    optional: true,
    autoform: {
      group: 'colors'
    }
  },
  headerTextColor: {
    type: String,
    optional: true,
    autoform: {
      group: 'colors'
    }
  },
  twitterAccount: {
    type: String,
    optional: true,
    autoform: {
      group: 'integrations'
    }
  },
  googleAnalyticsId: {
    type: String,
    optional: true,
    autoform: {
      group: 'integrations'
    }
  },
  mixpanelId: {
    type: String,
    optional: true,
    autoform: {
      group: 'integrations'
    }
  },
  clickyId: {
    type: String,
    optional: true,
    autoform: {
      group: 'integrations'
    }
  },
  footerCode: {
    type: String,
    optional: true,
    autoform: {
      group: 'extras',
      instructions: 'Footer content (accepts HTML).',
      rows: 5
    }
  },
  extraCode: {
    type: String,
    optional: true,
    autoform: {
      group: 'extras',
      instructions: 'Any extra HTML code you want to include on every page.',
      rows: 5
    }
  },
  emailFooter: {
    type: String,
    optional: true,
    autoform: {
      group: 'email',
      instructions: 'Content that will appear at the bottom of outgoing emails (accepts HTML).',
      rows: 5
    }
  },
  notes: {
    type: String,
    optional: true,
    autoform: {
      group: 'extras',
      instructions: 'You can store any notes or extra information here.',
      rows: 5
    }
  },
};

// add any extra properties to settingsSchemaObject (provided by packages for example)
_.each(addToSettingsSchema, function(item){
  settingsSchemaObject[item.propertyName] = item.propertySchema;
});

Settings = new Meteor.Collection("settings");
SettingsSchema = new SimpleSchema(settingsSchemaObject);
Settings.attachSchema(SettingsSchema);

// use custom template for checkboxes - not working yet
// if(Meteor.isClient){
//   AutoForm.setDefaultTemplateForType('afCheckbox', 'settings');
// }

Settings.allow({
  insert: isAdminById,
  update: isAdminById,
  remove: isAdminById
});

if (Meteor.isClient){
  var query = Settings.find();
  var handle = query.observeChanges({
    added: function (id, fields) {
      if (fields.language)
        T9n.setLanguage(fields.language);
    },
    changed: function (id, fields) {
      if (fields.language)
        T9n.setLanguage(fields.language);
    }
  });
}