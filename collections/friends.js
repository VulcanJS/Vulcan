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
    regEx: /^[a-z0-9A-Z_]{3,15}$/,
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
  profile: { // public and modifiable
    type: Object,
    optional: true,
    blackbox: true
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
  Meteor.methods({
    friendsFacebookIds: function (userId) {
      var user = Meteor.users.findOne(userId);
      if (!user || !user.services.facebook) return [];
      return _.pluck(HTTP.get('https://graph.facebook.com/v2.2/' + user.services.facebook.id + '/friends', {
        params: {access_token: user.services.facebook.accessToken, limit: 1000}
      }).data.data, 'id').concat(user.services.facebook.id);
    }
  });
}

