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
      optional: true
    }
  }
);

// Settings

// note for next two fields: need to add a way to tell app not to publish field to client except for admins

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
      group: 'newsletter'
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
      instructions: 'The ID of the list you want to send to.'
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
      instructions: 'Changes require restarting your app to take effect.',
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
        },
        {
          value: 0,
          label: "Don't send newsletter"
        }
      ]
    }
  }
}
addToSettingsSchema.push(newsletterFrequency);

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