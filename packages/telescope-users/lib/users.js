/**
 * Telescope Users namespace
 * @namespace Users
 */
Users = Meteor.users;

/**
 * Users schema
 * @type {SimpleSchema}
 */
 var usersSchema = new SimpleSchema({ 
  _id: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/,
    autoform: {
      omit: true
    }
  },
  emails: {
    type: [Object],
    autoform: {
      omit: true
    }
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      omit: true
    }
  },
  "emails.$.verified": {
    type: Boolean,
    autoform: {
      omit: true
    }
  },
  createdAt: {
    type: Date,
    autoform: {
      omit: true
    }
  },
  isAdmin: {
    type: Boolean,
    optional: true,
    autoform: {
      omit: true
    }
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true,
    autoform: {
      omit: true
    }
  },
  telescope: { // telescope-specific data
    type: telescopeUserDataSchema,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
    autoform: {
      omit: true
    }
  }
});

/**
 * Users schema
 * @type {SimpleSchema}
 */
var telescopeUserDataSchema = new SimpleSchema({
  displayName: {
    type: String,
    regEx: /^[a-zA-Z-]{2,25}$/,
    optional: true,
    autoform: {
      editable: true
    }
  },
  email: {
    type: String,
    regEx: /^[a-zA-Z]{2,25}$/,
    optional: true,
    autoform: {
      editable: true
    }
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    autoform: {
      editable: true
    }
  },
  twitterUsername: {
    type: String,
    optional: true,
    autoform: {
      editable: true
    }
  },
  bio: {
    type: String,
    optional: true,
    autoform: {
      editable: true
    }
  },
  htmlBio: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  city: {
    type: String,
    optional: true,
    autoform: {
      editable: true
    }
  },
  commentCount: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  emailHash: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  inviteCount: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  invitedCount: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  isInvited: {
    type: Boolean,
    optional: true,
    autoform: {
      omit: true
    }
  },
  karma: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  postCount: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  slug: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  downvotedComments: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
    }
  },
  downvotedPosts: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
    }
  },
  upvotedComments: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
    }
  },
  upvotedPosts: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
    }
  }
});

i18n.internationalizeSchema(usersSchema);

/**
 * Attach schema to Meteor.users collection
 */
Meteor.users.attachSchema(usersSchema);


/**
 * Users collection permissions
 */
Users.deny({
  update: function(userId, post, fieldNames) {
    if(Users.isAdminById(userId))
      return false;
    // deny the update if it contains something other than the profile field
    return (_.without(fieldNames, 'profile', 'username', 'slug').length > 0);
  }
});

Users.allow({
  update: function(userId, doc){
    return Users.isAdminById(userId) || userId == doc._id;
  },
  remove: function(userId, doc){
    return Users.isAdminById(userId) || userId == doc._id;
  }
});
