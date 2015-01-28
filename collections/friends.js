friendSchemaObj = { 
  _id: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  facebookId: {
    type: String,
    optional: true
  },
  facebookName: {
    type: String,
    optional: true
  },
  facebookFriendsIds: {
    type: [String], 
    optional: true
  },
  friendsIds: {
    type: [String], 
    optional: true
  },
  createdAt: {
    type: Date
  },
  votes: {
    type: [Object],
    optional: true
  },
  'votes.$.item': {
    type: String,
    optional: true
  },
  'votes.$.createdAt': {
    type: Date
  },
  'votes.$.optionOrder': {
    type: Number,
    optional: true
  },
  'votes.$.optionName': {
    type: String,
    optional: true
  },
  comments: {
    type: [Object],
    optional: true,
    blackbox: true
  },
  commentsVotes: {
    type: [Object],
    optional: true,
    blackbox: true
  }
};

// add any extra properties to friendSchemaObj (provided by packages for example)
_.each(addToUserSchema, function(item){
  friendSchemaObj[item.propertyName] = item.propertySchema;
});

Friends = new Meteor.Collection("friends");

FriendSchema= new SimpleSchema(friendSchemaObj);

Friends.attachSchema(FriendSchema);

if (Meteor.isServer) {

}

