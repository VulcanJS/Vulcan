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
    required: true,
    editableBy: ["member", "admin"],
    autoform: {
      rows: 5
    }
  },
  commentCount: {
    type: Number,
    optional: true
  },
  displayName: { // can contain spaces and special characters, doesn't need to be unique
    type: String,
    optional: true,
    editableBy: ["member", "admin"]
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
    optional: true,
    required: true,
    editableBy: ["member", "admin"]
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
    editableBy: ["member", "admin"]
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
    editableBy: ["member", "admin"]
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

/**
 * Attach schema to Meteor.users collection
 */
Users.attachSchema(Telescope.schemas.users);

/**
 * Users collection permissions
 */

Users.allow({
  update: _.partial(Telescope.allowCheck, Meteor.users),
  remove: _.partial(Telescope.allowCheck, Meteor.users)
});
