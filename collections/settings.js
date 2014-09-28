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
    label: 'Site URL (with trailing "/")',
    autoform: {
      group: 'general'
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
      group: 'access'
    }
  },
  requirePostInvite: {
    type: Boolean,
    label: "Require invite to post",
    optional: true,
    autoform: {
      group: 'access'
    }
  },
  requirePostsApproval: {
    type: Boolean,
    label: "Posts must be approved by admin",
    optional: true,
    autoform: {
      group: 'access'
    }
  },
  emailNotifications: {
    type: Boolean,
    label: "Enable email notifications",
    optional: true,
    autoform: {
      group: 'email'
    }
  },
  nestedComments: {
    type: Boolean,
    label: "Enable nested comments",
    optional: true,
    autoform: {
      group: 'comments'
    }
  },
  redistributeKarma: {
    type: Boolean,
    label: "Enable redistributed karma",
    optional: true,
    autoform: {
      group: 'general'
    }
  },
  defaultEmail: {
    type: String,
    optional: true,
    autoform: {
      group: 'email'
    }
  },
  scoreUpdateInterval: {
    type: Number,
    optional: true,
    autoform: {
      group: 'scoring'
    }
  },
  defaultView: {
    type: String,
    optional: true,
    autoform: {
      group: 'posts',
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
    autoform: {
      group: 'posts'
    }
  },
  commentInterval: {
    type: Number,
    optional: true,
    autoform: {
      group: 'comments'
    }
  },
  maxPostsPerDay: {
    type: Number,
    optional: true,
    autoform: {
      group: 'posts'
    }
  },
  startInvitesCount: {
    type: Number,
    defaultValue: 3,
    optional: true,
    autoform: {
      group: 'general'
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
      group: 'general'
    }
  },
  backgroundCSS: {
    type: String,
    optional: true,
    label: "Background CSS: color, image, etc.",
    autoform: {
      group: 'extras'
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
      group: 'extras'
    }
  },
  extraCode: {
    type: String,
    optional: true,
    autoform: {
      group: 'extras'
    }
  },
  emailFooter: {
    type: String,
    optional: true,
    autoform: {
      group: 'email'
    }
  },
  notes: {
    type: String,
    optional: true,
    autoform: {
      group: 'extras'
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
        T9n.language = fields.language;
    },
    changed: function (id, fields) {
      if (fields.language)
        T9n.language = fields.language;
    }
  });
}