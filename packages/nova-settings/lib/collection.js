import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';

const isInSettingsJSON = function () {
  // settings can either be in settings json's public, or in the special object we publish only for admins for private settings
  return typeof Telescope.settings.getFromJSON(this.name) !== "undefined" || typeof Telescope.settings.settingsJSON[this.name] !== "undefined";
};

const getFromJSON = function () {
  return Telescope.settings.getFromJSON(this.name) || Telescope.settings.settingsJSON[this.name];
};

Telescope.settings.collection = new Mongo.Collection("settings");

const canEdit = user => Users.canDo(user, "settings.edit");

Telescope.settings.schema = new SimpleSchema({
  title: {
    type: String,
    optional: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    publish: true,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      instructions: "Your site's title.",
      group: "01_general"
    }
  },
  siteUrl: {
    type: String,
    optional: true,
    publish: true,
    // regEx: SimpleSchema.RegEx.Url,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "01_general",
      type: "bootstrap-url",
      instructions:  'Your site\'s URL (with trailing "/"). Will default to Meteor.absoluteUrl()'
    }
  },
  tagline: {
    type: String,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "01_general"
    }
  },
  description: {
    type: String,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "01_general",
      rows: 5,
      instructions:  'A short description used for SEO purposes.'
    }
  },
  siteImage: {
    type: String,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    regEx: SimpleSchema.RegEx.Url,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "01_general",
      instructions:  "URL to an image for the open graph image tag for all pages"
    }
  },
  requireViewInvite: {
    type: Boolean,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    control: "checkbox",
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: 'invites',
      leftLabel: 'Require View Invite'
    }
  },
  requirePostInvite: {
    type: Boolean,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    control: "checkbox",
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: 'invites',
      leftLabel: 'Require Post Invite'
    }
  },
  requirePostsApproval: {
    type: Boolean,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    control: "checkbox",
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "01_general",
      instructions:  "Posts must be approved by admin",
      leftLabel: "Require Posts Approval"
    }
  },
  defaultEmail: {
    type: String,
    optional: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "06_email",
      instructions:  'The address all outgoing emails will be sent from.',
      class: "private-field"
    }
  },
  mailUrl: {
    type: String,
    optional: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "06_email",
      instructions:  'MAIL_URL environment variable (requires restart).',
      class: "private-field"
    }
  },
  scoreUpdateInterval: {
    type: Number,
    optional: true,
    defaultValue: 30,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: '01_general',
      instructions:  'How often to recalculate scores, in seconds (default to 30)',
      class: "private-field"
    }
  },
  postInterval: {
    type: Number,
    optional: true,
    publish: true,
    defaultValue: 30,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "02_posts",
      instructions:  'Minimum time between posts, in seconds (defaults to 30)'
    }
  },
  RSSLinksPointTo: {
    type: String,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    control: "radiogroup",
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
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
    publish: true,
    defaultValue: 15,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "03_comments",
      instructions:  'Minimum time between comments, in seconds (defaults to 15)'
    }
  },
  maxPostsPerDay: {
    type: Number,
    optional: true,
    publish: true,
    defaultValue: 30,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "02_posts",
      instructions:  'Maximum number of posts a user can post in a day (default to 30).'
    }
  },
  startInvitesCount: {
    type: Number,
    defaultValue: 3,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: 'invites'
    }
  },
  postsPerPage: {
    type: Number,
    defaultValue: 10,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "02_posts"
    }
  },
  logoUrl: {
    type: String,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "04_logo"
    }
  },
  logoHeight: {
    type: Number,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "04_logo"
    }
  },
  logoWidth: {
    type: Number,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "04_logo"
    }
  },
  faviconUrl: {
    type: String,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "04_logo"
    }
  },
  // language: {
  //   type: String,
  //   defaultValue: 'en',
  //   optional: true,
  //   insertableIf: canEdit,
  //   editableIf: canEdit,
  //   autoform: {
  //     group: "01_general",
  //     instructions:  'The app\'s language. Defaults to English.',
  //     options: function () {
  //       var languages = _.map(TAPi18n.getLanguages(), function (item, key) {
  //         return {
  //           value: key,
  //           label: item.name
  //         };
  //       });
  //       return languages;
  //     }
  //   }
  // },
  twitterAccount: {
    type: String,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "07_integrations"
    }
  },
  facebookPage: {
    type: String,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "07_integrations"
    }
  },
  googleAnalyticsId: {
    type: String,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "07_integrations"
    }
  },
  locale: {
    type: String,
    optional: true,
    publish: true,
    insertableIf: canEdit,
    editableIf: canEdit,
    autoform: {
      disabled: isInSettingsJSON,
      prefill: getFromJSON,
      group: "01_general"
    }
  }
});

Telescope.settings.collection.attachSchema(Telescope.settings.schema);

Telescope.subscriptions.preload("settings");