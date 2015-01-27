settingsSchemaObject = {
  title: {
    type: String,
    optional: true,
    autoform: {
      group: 'general'
    }
  },
  siteUrl: {
    type: String,
    optional: true,
    autoform: {
      group: 'general',
      instructions: 'Your site\'s URL (with trailing "/"). Will default to Meteor.absoluteUrl()'
    }
  },
  tagline: {
    type: String,
    optional: true,
    autoform: {
      group: 'general'
    }
  },
  description: {
    type: String,
    optional: true,
    autoform: {
      group: 'general',
      rows: 5,
      instructions: 'A short description used for SEO purposes.'
    }
  },
  requireViewInvite: {
    type: Boolean,
    optional: true,
    autoform: {
      group: 'invites',
      leftLabel: 'Require View Invite'
    }
  },
  requirePostInvite: {
    type: Boolean,
    optional: true,
    autoform: {
      group: 'invites',
      leftLabel: 'Require Post Invite'
    }
  },
  requirePostsApproval: {
    type: Boolean,
    optional: true,
    autoform: {
      group: 'general',
      instructions: "Posts must be approved by admin",
      leftLabel: "Require Posts Approval"
    }
  },
  defaultEmail: {
    type: String,
    optional: true,
    autoform: {
      group: 'email',
      instructions: 'The address all outgoing emails will be sent from.',
      private: true
    }
  },
  mailUrl: {
    type: String,
    optional: true,
    autoform: {
      group: 'email',
      instructions: 'MAIL_URL environment variable (requires restart).',
      private: true
    }
  },  
  scoreUpdateInterval: {
    type: Number,
    optional: true,
    defaultValue: 30,
    autoform: {
      group: 'scoring',
      instructions: 'How often to recalculate scores, in seconds (default to 30)',
      private: true
    }
  },
  defaultView: {
    type: String,
    optional: true,
    autoform: {
      group: 'posts',
      instructions: 'The view used for the front page',
      options: _.map(viewsMenu, function (view) {
        return {
          value: camelCaseify(view.label),
          label: view.label
        };
      })
    }
  },
  postsLayout: {
    type: String,
    optional: true,
    autoform: {
      group: 'posts',
      instructions: 'The layout used for post lists',
      options: [
        {value: 'posts-list', label: 'List'},
        {value: 'posts-grid', label: 'Grid'}
      ]
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
      instructions: 'The app\'s language. Defaults to English.',
      options: function () {
        var languages = _.map(TAPi18n.languages_available_for_project, function (item, key) {
          return {
            value: key,
            label: item[0]
          }
        });
        return languages
      }
    }
  },
  backgroundCSS: {
    type: String,
    optional: true,
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
      group: 'colors',
      // type: 'color'
    }
  },
  buttonTextColor: {
    type: String,
    optional: true,
    autoform: {
      group: 'colors',
      // type: 'color'
    }
  },
  headerColor: {
    type: String,
    optional: true,
    autoform: {
      group: 'colors',
      // type: 'color'
    }
  },
  headerTextColor: {
    type: String,
    optional: true,
    autoform: {
      group: 'colors',
      // type: 'color'
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
      instructions: 'Footer content (accepts Markdown).',
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
      rows: 5,
      private: true
    }
  },
  notes: {
    type: String,
    optional: true,
    autoform: {
      group: 'extras',
      instructions: 'You can store any notes or extra information here.',
      rows: 5,
      private: true
    }
  },
  debug: {
    type: Boolean,
    optional: true,
    autoform: {
      group: 'debug',
      instructions: 'Enable debug mode for more details console logs'
    }
  }
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
        setLanguage(fields.language)
    },
    changed: function (id, fields) {
      if (fields.language)
        setLanguage(fields.language)
    }
  });
}

Meteor.startup(function () {
  // override Meteor.absoluteUrl() with URL provided in settings
  Meteor.absoluteUrl.defaultOptions.rootUrl = getSetting('siteUrl', Meteor.absoluteUrl());
  debug = getSetting('debug', false);
});