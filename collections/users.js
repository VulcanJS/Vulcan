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
  profile: {
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

Meteor.users.allow({
  update: function(userId, doc){
  	return isAdminById(userId) || userId == doc._id;
  },
  remove: function(userId, doc){
  	return isAdminById(userId) || userId == doc._id;
  }
});