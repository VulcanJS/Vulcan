InviteSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  invitingUserId: {
    type: String,
    optional: true
  },
  invitedUserEmail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  accepted: {
    type: Boolean,
    optional: true
  }
});

Invites = new Meteor.Collection("invites");
Invites.attachSchema(InviteSchema);


// invites are managed through Meteor method

Invites.deny({
  insert: function(){ return true; },
  update: function(){ return true; },
  remove: function(){ return true; }
});