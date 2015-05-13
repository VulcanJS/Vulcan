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
  /**
    Bio (Markdown version)
  */
  bio: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      rows: 5
    }
  },
  /**
    Total comment count
  */
  commentCount: {
    type: Number,
    optional: true
  },
  /**
    The name displayed throughout the app. Can contain spaces and special characters, doesn't need to be unique
  */
  displayName: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"]
  },
  /**
    An array containing comment downvotes
  */
  downvotedComments: {
    type: [Telescope.schemas.votes],
    optional: true
  },
  /**
    An array containing posts downvotes
  */
  downvotedPosts: {
    type: [Telescope.schemas.votes],
    optional: true
  },
  /**
    The user's email. Modifiable. // TODO: enforce uniqueness and use for login
  */
  email: {
    type: String,
    optional: true,
    required: true,
    editableBy: ["member", "admin"]
  },
  /**
    A hash of the email, used for Gravatar // TODO: change this when email changes
  */
  emailHash: {
    type: String,
    optional: true
  },
  /**
    The HTML version of the bio field
  */
  htmlBio: {
    type: String,
    optional: true
  },
  /**
    A count of the user's remaining invites
  */
  inviteCount: {
    type: Number,
    optional: true
  },
  /**
    A count of how many users have been invited by the user
  */
  invitedCount: {
    type: Number,
    optional: true
  },
  /**
    Whether the user is invited or not
  */
  isInvited: {
    type: Boolean,
    optional: true
  },
  /**
    The user's karma
  */
  karma: {
    type: Number,
    decimal: true,
    optional: true
  },
  /**
    Total post count
  */
  postCount: {
    type: Number,
    optional: true
  },
  /**
    A blackbox modifiable object to store the user's settings
  */
  settings: {
    type: Object,
    optional: true,
    editableBy: ["member", "admin"],
    blackbox: true,
    autoform: {
      omit: true
    }
  },
  /**
    The user's profile URL slug // TODO: change this when displayName changes
  */
  slug: {
    type: String,
    optional: true
  },
  /**
    The user's Twitter username
  */
  twitterUsername: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"]
  },
  /**
    An array containing comments upvotes
  */
  upvotedComments: {
    type: [Telescope.schemas.votes],
    optional: true
  },
  /**
    An array containing posts upvotes
  */
  upvotedPosts: {
    type: [Telescope.schemas.votes],
    optional: true
  },
  /**
    A link to the user's homepage
  */
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
Users.schema = new SimpleSchema({ 
  _id: {
    type: String,
    optional: true
  },
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/,
    optional: true
  },
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  "emails.$.verified": {
    type: Boolean,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
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

Users.schema.internationalize();

/**
 * Attach schema to Meteor.users collection
 */
Users.attachSchema(Users.schema);

/**
 * Users collection permissions
 */

Users.allow({
  update: _.partial(Telescope.allowCheck, Meteor.users),
  remove: _.partial(Telescope.allowCheck, Meteor.users)
});
