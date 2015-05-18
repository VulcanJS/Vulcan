var campaignSchema = new SimpleSchema({
 _id: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  },
  sentAt: {
    type: String,
    optional: true
  },
  status: {
    type: String,
    optional: true
  },
  posts: {
    type: [String],
    optional: true
  },
  webHits: {
    type: Number,
    optional: true
  },
});

Campaigns = new Meteor.Collection("campaigns", {
  schema: campaignSchema
});

Posts.addField(
  {
    fieldName: 'scheduledAt',
    fieldSchema: {
      type: Date,
      optional: true,
      autoform: {
        omit: true
      }
    }
  }
);

// Settings

var enableNewsletter = {
  fieldName: 'enableNewsletter',
  fieldSchema: {
    type: Boolean,
    optional: true,
    autoform: {
      group: 'newsletter',
      instructions: 'Enable newsletter (requires restart).'
    }
  }
};
Settings.addField(enableNewsletter);

var showBanner = {
  fieldName: 'showBanner',
  fieldSchema: {
    type: Boolean,
    optional: true,
    label: 'Newsletter banner',
    autoform: {
      group: 'newsletter',
      instructions: 'Show newsletter sign-up form on the front page.'
    }
  }
};
Settings.addField(showBanner);

var mailChimpAPIKey = {
  fieldName: "mailChimpAPIKey",
  fieldSchema: {
    type: String,
    optional: true,
    private: true,
    autoform: {
      group: "newsletter",
      class: "private-field"
    }
  }
};
Settings.addField(mailChimpAPIKey);

var mailChimpListId = {
  fieldName: 'mailChimpListId',
  fieldSchema: {
    type: String,
    optional: true,
    private: true,
    autoform: {
      group: 'newsletter',
      instructions: 'The ID of the list you want to send to.',
      class: "private-field"
    }
  }
};
Settings.addField(mailChimpListId);

var postsPerNewsletter = {
  fieldName: 'postsPerNewsletter',
  fieldSchema: {
    type: Number,
    optional: true,
    autoform: {
      group: 'newsletter'
    }
  }
};
Settings.addField(postsPerNewsletter);

var newsletterFrequency = {
  fieldName: 'newsletterFrequency',
  fieldSchema: {
    type: Number,
    optional: true,
    autoform: {
      group: 'newsletter',
      instructions: 'Defaults to once a week. Changes require restarting your app to take effect.',
      options: [
        {
          value: 1,
          label: 'Every Day'
        },
        {
          value: 2,
          label: 'Mondays, Wednesdays, Fridays'
        },
        {
          value: 3,
          label: 'Mondays & Thursdays'
        },
        {
          value: 7,
          label: 'Once a week (Mondays)'
        }
      ]
    }
  }
};
Settings.addField(newsletterFrequency);

var newsletterTime = {
  fieldName: 'newsletterTime',
  fieldSchema: {
    type: String,
    optional: true,
    defaultValue: '00:00',
    autoform: {
      group: 'newsletter',
      instructions: 'Defaults to 00:00/12:00 AM. Time to send out newsletter if enabled.',
      type: 'time'
    }
  }
};
Settings.addField(newsletterTime);

var autoSubscribe = {
  fieldName: 'autoSubscribe',
  fieldSchema: {
    type: Boolean,
    optional: true,
    autoform: {
      group: 'newsletter',
      instructions: 'Automatically subscribe new users on sign-up.'
    }
  }
};
Settings.addField(autoSubscribe);

// create new "campaign" lens for all posts from the past X days that haven't been scheduled yet
Posts.views.add("campaign", function (terms) {
  return {
    find: {
      scheduledAt: {$exists: false},
      postedAt: {
        $gte: terms.after
      }
    },
    options: {sort: {sticky: -1, score: -1}}
  };
});

Telescope.modules.add("hero", {
  template: 'newsletter_banner',
  order: 10
});

 function subscribeUserOnCreation (user) {
  if (!!Settings.get('autoSubscribe') && !!Users.getEmail(user)) {
    addToMailChimpList(user, false, function (error, result) {
      console.log(error);
      console.log(result);
    });
  }
  return user;
}
Telescope.callbacks.add("onCreateUser", subscribeUserOnCreation);
