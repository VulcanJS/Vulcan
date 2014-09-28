var Schema = {};

Schema.User = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/
  },
  emails: {
    type: [Object]
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  profile: { // public and modifiable
    type: Object,
    optional: true,
    blackbox: true
  },
  data: { // public but not modifiable
    type: Object,
    optional: true,
    blackbox: true
  },
  votes: { // used for votes only
    type: Object,
    optional: true,
    blackbox: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

// Meteor.users.attachSchema(Schema.User);

Meteor.users.deny({
  update: function(userId, post, fieldNames) {
    console.log(fieldNames)
    if(isAdminById(userId))
      return false;
    // deny the update if it contains something other than the profile field
    return (_.without(fieldNames, 'profile', 'username', 'slug').length > 0);
  }
});

Meteor.users.allow({
  update: function(userId, doc){
  	return isAdminById(userId) || userId == doc._id;
  },
  remove: function(userId, doc){
  	return isAdminById(userId) || userId == doc._id;
  }
});