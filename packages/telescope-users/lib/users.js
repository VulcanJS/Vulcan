/**
 * Telescope Users namespace
 * @namespace Users
 */
Users = Meteor.users;



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
  displayName: {
    type: String,
    regEx: /^[a-zA-Z-]{2,25}$/,
    optional: true,
    autoform: {
      editable: true
    }
  },
  downvotedComments: {
    type: [Telescope.schemas.votes],
    optional: true,
    autoform: {
      omit: true
    }
  },
  downvotedPosts: {
    type: [Telescope.schemas.votes],
    optional: true,
    autoform: {
      omit: true
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
  emailHash: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  htmlBio: {
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
  twitterUsername: {
    type: String,
    optional: true,
    autoform: {
      editable: true
    }
  },
  upvotedComments: {
    type: [Telescope.schemas.votes],
    optional: true,
    autoform: {
      omit: true
    }
  },
  upvotedPosts: {
    type: [Telescope.schemas.votes],
    optional: true,
    autoform: {
      omit: true
    }
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    autoform: {
      editable: true
    }
  }
});

/**
 * Users schema
 * @type {SimpleSchema}
 */
Telescope.schemas.users = new SimpleSchema({ 
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
    type: Telescope.schemas.userData,
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



i18n.internationalizeSchema(Telescope.schemas.users);

/**
 * Attach schema to Meteor.users collection
 */
Meteor.users.attachSchema(Telescope.schemas.users);


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
