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
Settings.addToSchema(enableNewsletter);

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
Settings.addToSchema(showBanner);

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
Settings.addToSchema(mailChimpAPIKey);

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
Settings.addToSchema(mailChimpListId);

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
Settings.addToSchema(postsPerNewsletter);

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
Settings.addToSchema(newsletterFrequency);

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
Settings.addToSchema(newsletterTime);

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
Settings.addToSchema(autoSubscribe);

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
  template: 'newsletterBanner',
  order: 10
});

 function subscribeUserOnCreation (user) {
  if (!!Settings.get('autoSubscribe') && !!getEmail(user)) {
    addToMailChimpList(user, false, function (error, result) {
      console.log(error)
      console.log(result)
    });
  }
  return user;
}
userCreatedCallbacks.push(subscribeUserOnCreation);
