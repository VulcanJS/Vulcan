campaignSchema = new SimpleSchema({
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

addToPostSchema.push(
  {
    propertyName: 'scheduledAt',
    propertySchema: {
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
  propertyName: 'enableNewsletter',
  propertySchema: {
    type: Boolean,
    optional: true,
    autoform: {
      group: 'newsletter',
      instructions: 'Enable newsletter (requires restart).'
    }
  }
}
addToSettingsSchema.push(enableNewsletter);

var showBanner = {
  propertyName: 'showBanner',
  propertySchema: {
    type: Boolean,
    optional: true,
    label: 'Newsletter banner',
    autoform: {
      group: 'newsletter',
      instructions: 'Show newsletter sign-up form on the front page.'
    }
  }
}
addToSettingsSchema.push(showBanner);

var mailChimpAPIKey = {
  propertyName: 'mailChimpAPIKey',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: 'newsletter',
      private: true
    }
  }
}
addToSettingsSchema.push(mailChimpAPIKey);

var mailChimpListId = {
  propertyName: 'mailChimpListId',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: 'newsletter',
      instructions: 'The ID of the list you want to send to.',
      private: true
    }
  }
}
addToSettingsSchema.push(mailChimpListId);

var postsPerNewsletter = {
  propertyName: 'postsPerNewsletter',
  propertySchema: {
    type: Number,
    optional: true,
    autoform: {
      group: 'newsletter'
    }
  }
}
addToSettingsSchema.push(postsPerNewsletter);

var newsletterFrequency = {
  propertyName: 'newsletterFrequency',
  propertySchema: {
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
}
addToSettingsSchema.push(newsletterFrequency);

var newsletterTime = {
  propertyName: 'newsletterTime',
  propertySchema: {
    type: String,
    optional: true,
    defaultValue: '00:00',
    autoform: {
      group: 'newsletter',
      instructions: 'Defaults to 00:00/12:00 AM. Time to send out newsletter if enabled.',
      type: 'time'
    }
  }
}
addToSettingsSchema.push(newsletterTime);

var autoSubscribe = {
  propertyName: 'autoSubscribe',
  propertySchema: {
    type: Boolean,
    optional: true,
    autoform: {
      group: 'newsletter',
      instructions: 'Automatically subscribe new users on sign-up.'
    }
  }
}
addToSettingsSchema.push(autoSubscribe);

// create new "campaign" lens for all posts from the past X days that haven't been scheduled yet
viewParameters.campaign = function (terms) {
  return {
    find: {
      scheduledAt: {$exists: false},
      postedAt: {
        $gte: terms.after
      }
    },
    options: {sort: {sticky: -1, score: -1}}
  };
}

heroModules.push({
  template: 'newsletterBanner'
});

 function subscribeUserOnCreation (user) {
  if (!!getSetting('autoSubscribe') && !!getEmail(user)) {
    addToMailChimpList(user, false, function (error, result) {
      console.log(error)
      console.log(result)
    });
  }
  return user;
}
userCreatedCallbacks.push(subscribeUserOnCreation);
