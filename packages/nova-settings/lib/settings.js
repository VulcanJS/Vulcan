/**
 * The global namespace for Settings.
 * @namespace Settings
 */
Telescope.settings.collection = new Mongo.Collection("settings");

Telescope.settings.schema = new SimpleSchema({
  title: {
    type: String,
    optional: true,
    autoform: {
      group: "01_general"
    }
  },
  siteUrl: {
    type: String,
    optional: true,
    // regEx: SimpleSchema.RegEx.Url,
    autoform: {
      group: "01_general",
      type: "bootstrap-url",
      instructions: 'Your site\'s URL (with trailing "/"). Will default to Meteor.absoluteUrl()'
    }
  },
  tagline: {
    type: String,
    optional: true,
    autoform: {
      group: "01_general"
    }
  },
  description: {
    type: String,
    optional: true,
    autoform: {
      group: "01_general",
      rows: 5,
      instructions: 'A short description used for SEO purposes.'
    }
  },
  siteImage: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
    autoform: {
      group: "01_general",
      instructions: "URL to an image for the open graph image tag for all pages"
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
      group: "01_general",
      instructions: "Posts must be approved by admin",
      leftLabel: "Require Posts Approval"
    }
  },
  defaultEmail: {
    type: String,
    optional: true,
    private: true,
    autoform: {
      group: "06_email",
      instructions: 'The address all outgoing emails will be sent from.',
      class: "private-field"
    }
  },
  mailUrl: {
    type: String,
    optional: true,
    private: true,
    autoform: {
      group: "06_email",
      instructions: 'MAIL_URL environment variable (requires restart).',
      class: "private-field"
    }
  },
  scoreUpdateInterval: {
    type: Number,
    optional: true,
    defaultValue: 30,
    private: true,
    autoform: {
      group: '01_general',
      instructions: 'How often to recalculate scores, in seconds (default to 30)',
      class: "private-field"
    }
  },
  defaultView: {
    type: String,
    optional: true,
    autoform: {
      group: "02_posts",
      instructions: 'The view used for the front page',
      options: function () {
        return _.map(Telescope.menuItems.get("viewsMenu"), function (view) {
          return {
            value: view.name,
            label: view.label()
          };
        });
      }
    }
  },
  postInterval: {
    type: Number,
    optional: true,
    defaultValue: 30,
    autoform: {
      group: "02_posts",
      instructions: 'Minimum time between posts, in seconds (defaults to 30)'
    }
  },
  RSSLinksPointTo: {
    type: String,
    optional: true,
    autoform: {
      group: "02_posts",
      options: [
        {value: 'page', label: 'Discussion page'},
        {value: 'link', label: 'Outgoing link'}
      ]
    }
  },
  commentInterval: {
    type: Number,
    optional: true,
    defaultValue: 15,
    autoform: {
      group: "03_comments",
      instructions: 'Minimum time between comments, in seconds (defaults to 15)'
    }
  },
  maxPostsPerDay: {
    type: Number,
    optional: true,
    defaultValue: 30,
    autoform: {
      group: "02_posts",
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
      group: "02_posts"
    }
  },
  logoUrl: {
    type: String,
    optional: true,
    autoform: {
      group: "04_logo"
    }
  },
  logoHeight: {
    type: Number,
    optional: true,
    autoform: {
      group: "04_logo"
    }
  },
  logoWidth: {
    type: Number,
    optional: true,
    autoform: {
      group: "04_logo"
    }
  },
  faviconUrl: {
    type: String,
    optional: true,
    autoform: {
      group: "04_logo"
    }
  },
  language: {
    type: String,
    defaultValue: 'en',
    optional: true,
    autoform: {
      group: "01_general",
      instructions: 'The app\'s language. Defaults to English.',
      options: function () {
        var languages = _.map(TAPi18n.getLanguages(), function (item, key) {
          return {
            value: key,
            label: item.name
          };
        });
        return languages;
      }
    }
  },
  twitterAccount: {
    type: String,
    optional: true,
    autoform: {
      group: "07_integrations"
    }
  },
  facebookPage: {
    type: String,
    optional: true,
    autoform: {
      group: "07_integrations"
    }
  },
  googleAnalyticsId: {
    type: String,
    optional: true,
    autoform: {
      group: "07_integrations"
    }
  },
  emailFooter: {
    type: String,
    optional: true,
    private: true,
    autoform: {
      group: "06_email",
      instructions: 'Content that will appear at the bottom of outgoing emails (accepts HTML).',
      rows: 5,
      class: "private-field"
    }
  }
});


// Meteor.startup(function(){
//   Settings.internationalize();
// });

Telescope.settings.collection.attachSchema(Telescope.settings.schema);

Telescope.subscriptions.preload("settings");

// Settings.get = function(setting, defaultValue) {
//   var settings = Settings.find().fetch()[0];

//   if(settings && (typeof settings[setting] !== 'undefined')) { // look in Settings collection first
//     return settings[setting];

//   } else if (Meteor.isServer && Meteor.settings && !!Meteor.settings[setting]) { // else if on the server, look in Meteor.settings
//     return Meteor.settings[setting];

//   } else if (Meteor.settings && Meteor.settings.public && !!Meteor.settings.public[setting]) { // look in Meteor.settings.public
//     return Meteor.settings.public[setting];

//   } else if (typeof defaultValue !== 'undefined') { // fallback to default
//     return  defaultValue;

//   } else { // or return undefined
//     return undefined;
//   }
// };



// /**
//  * Add trailing slash if needed on insert
//  */
// Settings.before.insert(function (userId, doc) {
//   if(doc.siteUrl && doc.siteUrl.match(/\//g).length === 2) {
//     doc.siteUrl = doc.siteUrl + "/";
//   }
// });

// /**
//  * Add trailing slash if needed on update
//  */
// Settings.before.update(function (userId, doc, fieldNames, modifier) {
//   if(modifier.$set && modifier.$set.siteUrl && modifier.$set.siteUrl.match(/\//g).length === 2) {
//     modifier.$set.siteUrl = modifier.$set.siteUrl + "/";
//   }
// });

// Meteor.startup(function () {
//   Settings.allow({
//     insert: Users.is.adminById,
//     update: Users.is.adminById,
//     remove: Users.is.adminById
//   });
// });

// Meteor.startup(function () {
//   // override Meteor.absoluteUrl() with URL provided in settings
//   Meteor.absoluteUrl.defaultOptions.rootUrl = Settings.get('siteUrl', Meteor.absoluteUrl());
//   debug = Settings.get('debug', false);
// });
