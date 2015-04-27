/**
 * Vote schema
 * @type {SimpleSchema}
 */
Telescope.schemas.votes = new SimpleSchema({
  itemId: {
    type: String
  },
  power: {
    type: Number,
    optional: true
  },
  votedAt: {
    type: Date, 
    optional: true
  }
});

/**
 * User Data schema
 * @type {SimpleSchema}
 */
Telescope.schemas.userData = new SimpleSchema({
  bio: {
    type: String,
    optional: true,
    editableBy: ["owner", "admin"]
  },
  commentCount: {
    type: Number,
    optional: true
  },
  displayName: {
    type: String,
    regEx: /^[a-zA-Z-]{2,25}$/,
    optional: true,
    editableBy: ["owner", "admin"]
  },
  downvotedComments: {
    type: [Telescope.schemas.votes],
    optional: true
  },
  downvotedPosts: {
    type: [Telescope.schemas.votes],
    optional: true
  },
  email: {
    type: String,
    regEx: /^[a-zA-Z]{2,25}$/,
    optional: true,
    editableBy: ["owner", "admin"]
  },
  emailHash: {
    type: String,
    optional: true
  },
  htmlBio: {
    type: String,
    optional: true
  },
  inviteCount: {
    type: Number,
    optional: true
  },
  invitedCount: {
    type: Number,
    optional: true
  },
  isInvited: {
    type: Boolean,
    optional: true
  },
  karma: {
    type: Number,
    optional: true
  },
  postCount: {
    type: Number,
    optional: true
  },
  slug: {
    type: String,
    optional: true
  },
  twitterUsername: {
    type: String,
    optional: true,
    editableBy: ["owner", "admin"]
  },
  upvotedComments: {
    type: [Telescope.schemas.votes],
    optional: true
  },
  upvotedPosts: {
    type: [Telescope.schemas.votes],
    optional: true
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    editableBy: ["owner", "admin"]
  }
});

/**
 * Users schema
 * @type {SimpleSchema}
 */
Telescope.schemas.users = new SimpleSchema({ 
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
  isAdmin: {
    type: Boolean,
    optional: true
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true
  },
  telescope: { // telescope-specific data
    type: Telescope.schemas.userData,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  }
});



Telescope.schemas.users.internationalize();

Telescope.schemas.users.setPermissions();

/**
 * Attach schema to Meteor.users collection
 */
Meteor.users.attachSchema(Telescope.schemas.users);


/**
 * Users collection permissions
 */
Users.deny({
  update: function(userId, post, fieldNames) {
    if(Users.is.adminById(userId))
      return false;
    // deny the update if it contains something other than the profile field
    return (_.without(fieldNames, 'profile', 'username', 'slug').length > 0);
  }
});

Users.allow({
  update: function(userId, doc){
    return Users.is.adminById(userId) || userId == doc._id;
  },
  remove: function(userId, doc){
    return Users.is.adminById(userId) || userId == doc._id;
  }
});
