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
    propertyName: 'sentAt',
    propertySchema: {
      type: Date,
      optional: true
    }
  }
);

viewParameters.campaign = function (terms) {
  return {
    find: {sentAt: {$exists: false}}, 
    options: {sort: {sticky: -1, score: -1}}
  };
}