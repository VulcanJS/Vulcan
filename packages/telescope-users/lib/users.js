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
    public: true,
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
    public: true,
    optional: true,
    autoform: {
      omit: true
    },
    template: "user_profile_bio"
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
    public: true,
    editableBy: ["member", "admin"],
    template: "user_profile_twitter"
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
    public: true,
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
    optional: true,
    editableBy: ["admin"],
    autoform: {
      omit: true
    }
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


//////////////////////////////////////////////////////
// Collection Hooks                                 //
// https://atmospherejs.com/matb33/collection-hooks //
//////////////////////////////////////////////////////

/**
 * Generate HTML body from Markdown on user bio insert
 */
Users.after.insert(function (userId, user) {

  // run create user async callbacks
  Telescope.callbacks.runAsync("onCreateUserAsync", user);

  // check if all required fields have been filled in. If so, run profile completion callbacks
  if (Users.hasCompletedProfile(user)) {
    Telescope.callbacks.runAsync("profileCompletedAsync", user);
  }
  
});

/**
 * Generate HTML body from Markdown when user bio is updated
 */
Users.before.update(function (userId, doc, fieldNames, modifier) {
  // if bio is being modified, update htmlBio too
  if (Meteor.isServer && modifier.$set && modifier.$set["telescope.bio"]) {
    modifier.$set["telescope.htmlBio"] = Telescope.utils.sanitize(marked(modifier.$set["telescope.bio"]));
  }
});

/**
 * If user.telescope.email has changed, check for existing emails and change user.emails if needed
 */
Users.before.update(function (userId, doc, fieldNames, modifier) {
  var user = doc;
  // if email is being modified, update user.emails too
  if (Meteor.isServer && modifier.$set && modifier.$set["telescope.email"]) {
    var newEmail = modifier.$set["telescope.email"];

    // check for existing emails and throw error if necessary
    var userWithSameEmail = Users.findByEmail(newEmail);
    if (userWithSameEmail && userWithSameEmail._id !== doc._id) {
      throw new Meteor.Error(i18n.t("this_email_is_already_taken") + " (" + newEmail + ")");
    }

    // if user.emails exists, change it too
    if (!!user.emails) {
      user.emails[0].address = newEmail;
      modifier.$set.emails = user.emails;
    }

  }
});