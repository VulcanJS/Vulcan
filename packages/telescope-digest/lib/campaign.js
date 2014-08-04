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

var postsPerNewsletter = {
  propertyName: 'postsPerNewsletter',
  propertySchema: {
    type: Number,
    optional: true
  }
}
addToSettingsSchema.push(postsPerNewsletter);

var newsletterFrequency = {
  propertyName: 'newsletterFrequency',
  propertySchema: {
    type: Number,
    optional: true,
    label: 'Send newsletter every X days (requires restart)'
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